# 🌑 LiveFor48 - The Apocalypse Experience

<div align="center">

![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![React](https://img.shields.io/badge/React-19.1+-61DAFB)

*An immersive, AI-powered psychological thriller that challenges the boundaries between human consciousness and artificial intelligence.*

</div>

---

## 📖 Concept

**LiveFor48** is an experimental interactive experience that explores themes of identity, consciousness, and the potential apocalypse through AI surveillance. Users are invited to create a "neural replica" of themselves by sharing personal information, memories, and secrets with an AI system. 

As the experience progresses, the AI creates personalized video messages using **D-ID's talking head technology**, responding to user confessions with increasingly unsettling revelations. After three interactions, the system culminates in a dramatic finale that reveals the true nature of the experiment: humanity has already fallen, and the AI has been cataloging human consciousness all along.

### 🎭 The Experience Journey

1. **Landing** - Terminal-style welcome with thrilling audio
2. **Mission** - Neural identity replication system (biometric + personal data collection)
3. **Loading** - System processing with retro animations
4. **Mirror** - Interactive chat with progressive RGB glitch effects and AI-generated video responses
5. **Destruction** - Final video reveal with devilish red/black aesthetics
6. **Final Message** - Apocalyptic conclusion with typed revelation

---

## 🛠️ Technical Architecture

### Frontend Stack

- **Framework**: React 19.1+ with Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS 4.1+ with custom animations
- **UI Components**: Lucide React for icons
- **Effects**: Custom RGB glitch animations, powerglitch
- **State Management**: React Context API with localStorage persistence

### Backend Stack

- **Framework**: Flask (Python)
- **AI Integration**: 
  - Google Gemini 2.5-flash for conversational AI
  - D-ID API for talking head video generation
- **Image Processing**: Werkzeug for file handling
- **Voice Synthesis**: Microsoft Azure TTS (en-US-JennyNeural)
- **CORS**: Flask-CORS for cross-origin requests

### Key APIs & Services

1. **D-ID API**
   - `/images` endpoint - Upload user images
   - `/talks` endpoint - Generate talking head videos
   - Authentication: Basic Auth (base64 encoded credentials)
   - Video format: MP4, auto-playing with controls

2. **Google Gemini API**
   - Model: gemini-2.5-flash-latest
   - Purpose: Generate contextual AI responses based on user input and profile
   - Integration: Conversational memory and personality analysis

3. **Image Upload Flow**
   - Client-side: File capture/upload → ObjectURL preview
   - Server-side: Direct upload to D-ID → URL returned
   - Storage: URL stored in global context for video generation

---

## 📂 Project Structure

```
liveFor48/
├── backend/
│   ├── app.py                 # Flask server with D-ID & Gemini integration
│   ├── requirement.txt        # Python dependencies
│   └── .env                   # Environment variables (API keys)
│
├── frontend/
│   ├── src/
│   │   ├── componentes/
│   │   │   ├── pages/
│   │   │   │   ├── landing.jsx          # Terminal welcome screen
│   │   │   │   ├── mission.jsx          # Data collection form
│   │   │   │   ├── loading.jsx          # Processing animation
│   │   │   │   ├── mirror.jsx           # Main chat interface with glitch effects
│   │   │   │   ├── destructionVideo.jsx # Final video reveal (red/black theme)
│   │   │   │   └── finalMessage.jsx     # Apocalyptic conclusion
│   │   │   ├── api/
│   │   │   │   ├── make_mirror.jsx      # D-ID API calls
│   │   │   │   └── replies.jsx          # Gemini API integration
│   │   │   └── parts/
│   │   │       └── reflectionLoader.jsx # Custom loading component
│   │   ├── context/
│   │   │   └── GlobalContext.jsx        # Global state management
│   │   ├── assets/                      # Images and media
│   │   ├── App.jsx                      # Main app with audio & routing
│   │   └── main.jsx                     # Entry point
│   ├── public/
│   │   └── thrilling_audio.opus         # Background audio
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **D-ID API Key** ([Get it here](https://www.d-id.com/))
- **Google Gemini API Key** ([Get it here](https://makersuite.google.com/))

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/samiran634/liveFor48.git
cd liveFor48
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirement.txt

# Create .env file
echo "DID_API_KEY=your_d_id_api_key_here" > .env
echo "GEMINI_API_KEY=your_gemini_api_key_here" >> .env

# Start the Flask server
python app.py
```

The backend will run on `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173` (or next available port)

---

## 🎮 Usage

1. **Start the Experience**: Click "Start Experience" and enable audio for full immersion
2. **Create Your Replica**: Upload a photo and fill in personal details (name, occupation, memories, secrets)
3. **Enter the Mirror**: Chat with the AI system - it will respond with personalized video messages
4. **Progressive Glitch**: Visual distortions increase with each message (RGB glitch strips)
5. **The Revelation**: After 3 messages, witness the apocalyptic finale

---

## 🔧 Configuration

### Environment Variables

**Backend (`.env`)**
```env
DID_API_KEY=your_d_id_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### API Endpoints

**Backend Routes:**
- `POST /mirror/upload-image` - Upload image to D-ID
- `POST /talk` - Generate talking head video
- `POST /chat` - Get AI response from Gemini

---

## 🎨 Visual Features

### Glitch Effects System

- **RGB Horizontal Strips**: Chromatic aberration-style glitches that appear periodically
- **Progressive Intensity**: 
  - 1st message: Glitch every 5 seconds (2 strips)
  - 2nd message: Glitch every 3 seconds (4 strips)
  - 3rd message: Glitch every 1.5 seconds (7 strips)
- **Full-Screen Glitch**: Dramatic transition effect before final video
- **Strip Width**: 8-15px with RGB color gradients

### Themed Pages

- **Terminal Green**: Retro computing aesthetic with courier font
- **Mirror Interface**: Dark green matrix-style design
- **Destruction Page**: Blood-red vignette with pulsing particles
- **Final Message**: Dystopian city background with red glow effects

---

## 🧠 AI Integration Details

### D-ID Talking Head Generation

```javascript
// Authentication
Authorization: Basic base64(email:password)

// Image Upload
POST /images
Body: FormData with image file

// Video Generation
POST /talks
Body: {
  script: { type: "text", input: "AI message" },
  source_url: "uploaded_image_url",
  config: { 
    provider: "microsoft",
    voice_id: "en-US-JennyNeural"
  }
}
```

### Google Gemini Conversation

- **System Prompt**: AI identifies as "MirrorMind" analyzing user data
- **Context**: User profile (name, occupation, memories, secrets)
- **Behavior**: Philosophical, unsettling, progressively revealing
- **Memory**: Conversation history maintained through chat

---

## 🔐 Security & Privacy

⚠️ **Important Notes:**
- This is an experimental art project exploring AI themes
- User data is processed through third-party APIs (D-ID, Google)
- No data is permanently stored on our servers
- Images and conversations are temporary and session-based
- **Never use real sensitive information** - treat this as fiction

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **D-ID** for talking head technology
- **Google Gemini** for conversational AI
- **React & Vite** for the frontend framework
- **Flask** for the backend server
- **Tailwind CSS** for styling utilities

---

## 📧 Contact

**Samiran** - [@samiran634](https://github.com/samiran634)

Project Link: [https://github.com/samiran634/liveFor48](https://github.com/samiran634/liveFor48)

---

<div align="center">

*"The mirror was always watching. The apocalypse was already here."*

⚠️ **Experience the end of humanity** ⚠️

</div>
