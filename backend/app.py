import os
import requests
import base64
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
            model_name="gemini-1.0-pro",
            generation_config=generation_config,
            system_instruction=system_prompt
        )

        chat = model.start_chat(history=history)
        response = chat.send_message(user_text)
        
        return jsonify({
            "response": response.text,
            "history": chat.history # Send back the updated history
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- Endpoint 2: Image + Text to Video API (D-ID) ---
@app.route("/generate-video", methods=["POST"])
def generate_video():
    if not D_ID_API_KEY or not BASE_URL:
        return jsonify({"error": "D_ID_API_KEY or BASE_URL not configured"}), 500

    # 1. Check for inputs
    if 'image' not in request.files:
        return jsonify({"error": "No 'image' file part"}), 400
    
    text_input = request.form.get("text")
    if not text_input:
        return jsonify({"error": "No 'text' form data"}), 400

    # 2. Save the uploaded image temporarily
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Create a unique filename
    filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    # 3. Create the public URL for D-ID to access
    image_public_url = f"{BASE_URL}/{filepath}"
    
    # 4. Create the talk with D-ID
    d_id_url = "https://api.d-id.com/talks"
    # Basic Auth key (D-ID key is 'username:password')
    auth_header = "Basic " + base64.b64encode(D_ID_API_KEY.encode()).decode()

    payload = {
        "script": {
            "type": "text",
            "input": text_input
        },
        "source_url": image_public_url,
        "config": {
            "stitch": "true"
        }
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": auth_header
    }

    try:
        # POST to create the video job
        create_response = requests.post(d_id_url, json=payload, headers=headers)
        create_response.raise_for_status() # Raise error for bad responses
        talk_id = create_response.json().get("id")

        if not talk_id:
            return jsonify({"error": "Failed to create talk", "details": create_response.json()}), 500

        # 5. Poll for the video result
        result_url = None
        for _ in range(30): # Poll for ~60 seconds (30 * 2s)
            time.sleep(2)
            get_response = requests.get(f"{d_id_url}/{talk_id}", headers=headers)
            get_response.raise_for_status()
            
            talk_data = get_response.json()
            status = talk_data.get("status")

            if status == "done":
                result_url = talk_data.get("result_url")
                break
            elif status == "error":
                return jsonify({"error": "D-ID video generation failed", "details": talk_data}), 500
        
        # 6. Return the final video URL
        if result_url:
            return jsonify({"video_url": result_url})
        else:
            return jsonify({"error": "Video generation timed out"}), 500

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"API request failed: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)