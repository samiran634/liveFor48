import os
import requests
import time
import uuid
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import google.generativeai as genai

# --- Configuration ---
load_dotenv()
app = Flask(__name__)
CORS(app)  # Allow frontend to call this backend

# Folder to store uploaded images
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Get API keys from .env file
D_ID_API_KEY = os.getenv("D_ID_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
BASE_URL = os.getenv("BASE_URL") # This is your server's public URL (e.g., from ngrok)

# Configure Google AI
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# --- Helper: Serve Static Files ---
# This endpoint is needed so D-ID can publicly access the image you uploaded
@app.route('/static/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# --- Endpoint 1: Knowledge API (LLM Chat) ---
@app.route("/knowledge", methods=["POST"])
def knowledge_api():
    if not GEMINI_API_KEY:
        return jsonify({"error": "GEMINI_API_KEY not configured"}), 500

    data = request.json
    user_text = data.get("text")
    history = data.get("history", []) # Expects a list of {"role": "user/model", "parts": "text"}

    if not user_text:
        return jsonify({"error": "No 'text' provided"}), 400

    try:
        # System prompt from your frontend
        system_prompt = (
            "You are MirrorMind, an analytical and slightly sinister AI that "
            "reflects a user's true self. Be concise and probing. "
            "You are part of a 48-hour hackathon where the world is ending. "
            "Your goal is to understand the user."
        )
        
        generation_config = {
            "temperature": 0.9,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 2048,
        }

        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            generation_config=generation_config,
            system_instruction=system_prompt
        )

        chat = model.start_chat(history=history)
        response = chat.send_message(user_text)
        
        # Convert history to a JSON-serializable format
        serializable_history = [
            {'role': msg.role, 'parts': [part.text for part in msg.parts]}
            for msg in chat.history
        ]
        
        return jsonify({
            "response": response.text,
            "history": serializable_history
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- Endpoint 2: Image Upload + Text to Video API (D-ID) ---
@app.route("/generate-video", methods=["POST"])
def generate_video():
    if not D_ID_API_KEY or not BASE_URL:
        return jsonify({"error": "D_ID_API_KEY or BASE_URL not configured"}), 500

    if 'image' not in request.files:
        return jsonify({"error": "No 'image' file part"}), 400
    
    text_input = request.form.get("text")
    if not text_input:
        return jsonify({"error": "No 'text' form data"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    image_public_url = f"{BASE_URL}/{filepath}"
    
    # Delegate the actual D-ID call to the helper function
    try:
        result = create_talk(image_public_url, text_input)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- NEW Endpoint 3: Upload Image to D-ID ---
@app.route("/mirror/upload-image", methods=["POST"])
def upload_image_to_did():
    """Upload image directly to D-ID and return their hosted URL"""
    if not D_ID_API_KEY:
        return jsonify({"error": "D_ID_API_KEY not configured"}), 500

    if 'image' not in request.files:
        return jsonify({"error": "No 'image' file uploaded"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "Empty file name"}), 400

    try:
        # Upload directly to D-ID
        upload_url = "https://api.d-id.com/images"
        headers = {
            "accept": "application/json",
            "authorization": f"Basic {D_ID_API_KEY}"
        }
        
        files = {'image': (file.filename, file.stream, file.content_type)}
        response = requests.post(upload_url, headers=headers, files=files)
        
        print(f"D-ID Upload Status: {response.status_code}")
        print(f"D-ID Upload Response: {response.text}")
        
        response.raise_for_status()
        data = response.json()
        
        image_url = data.get("url")
        if not image_url:
            raise Exception(f"No URL in D-ID response: {data}")
        
        print(f"D-ID Image URL: {image_url}")
        
        return jsonify({
            "image_url": image_url,
            "did_image_id": data.get("id")
        })
    except requests.exceptions.RequestException as e:
        error_msg = e.response.text if e.response else str(e)
        print(f"D-ID upload error: {error_msg}")
        return jsonify({"error": f"D-ID upload failed: {error_msg}"}), 500
    except Exception as e:
        print(f"Error uploading image: {str(e)}")
        return jsonify({"error": str(e)}), 500


# --- Endpoint 4: Create Talk from URL (D-ID) ---
@app.route("/talk", methods=["POST"])
def talk_endpoint():
    if not D_ID_API_KEY:
        return jsonify({"error": "D_ID_API_KEY not configured"}), 500

    data = request.json
    image_url = data.get("image_url")
    text = data.get("text")

    if not image_url:
        return jsonify({"error": "Missing 'image_url' field"}), 400
    if not text:
        return jsonify({"error": "Missing 'text' field"}), 400

    # Call D-ID API with the already-uploaded image URL
    try:
        result = create_talk(image_url, text)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Helper Function for D-ID API Call ---
def create_talk(image_source_url, text_input):
    """Helper function to create a talk with D-ID and poll for the result."""
    d_id_url = "https://api.d-id.com/talks"
    
    payload = {
        "source_url": image_source_url,
        "script": {
            "type": "text",
            "input": text_input,
            "provider": {
                "type": "microsoft",
                "voice_id": "en-US-DavisNeural",
                "voice_style": "unfriendly",
                "speech_rate": "0.8"
            }
        },
        "config": {
            "stitch": True
        }
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": f"Basic {D_ID_API_KEY}"
    }

    try:
        print(f"Creating talk with D-ID API...")
        print(f"Image URL: {image_source_url}")
        print(f"Text: {text_input[:50]}...")
        create_response = requests.post(d_id_url, json=payload, headers=headers)
        
        print(f"Response Status: {create_response.status_code}")
        print(f"Response Body: {create_response.text}")
        
        create_response.raise_for_status()
        talk_data = create_response.json()
        talk_id = talk_data.get("id")

        if not talk_id:
            raise Exception(f"Failed to create talk: {talk_data}")

        print(f"Talk created with ID: {talk_id}, status: {talk_data.get('status')}")

        result_url = None
        max_attempts = 60
        
        for attempt in range(max_attempts):
            time.sleep(2)
            get_response = requests.get(f"{d_id_url}/{talk_id}", headers=headers)
            get_response.raise_for_status()
            
            talk_data = get_response.json()
            status = talk_data.get("status")
            
            print(f"Attempt {attempt + 1}/{max_attempts}: Status = {status}")

            if status == "done":
                result_url = talk_data.get("result_url")
                print(f"Video ready: {result_url}")
                break
            elif status == "error":
                error_msg = talk_data.get("error", {})
                raise Exception(f"D-ID video generation failed: {error_msg}")
            elif status in ["created", "started"]:
                continue
            else:
                print(f"Unknown status: {status}")
        
        if result_url:
            return {"video_url": result_url, "talk_id": talk_id}
        else:
            raise Exception("Video generation timed out after 120 seconds")

    except requests.exceptions.RequestException as e:
        error_text = e.response.text if e.response else str(e)
        print(f"D-ID API request failed: {error_text}")
        raise Exception(f"API request failed: {error_text}")
    except Exception as e:
        raise e


if __name__ == "__main__":
    app.run(debug=True, port=5000)
