# LiveFor48 - Fixes and Setup Guide

## Issues Fixed

### 1. Backend Issues
- ✅ **D-ID Authentication**: Changed from incorrect Basic auth to Bearer token authentication
- ✅ **Image Upload**: Backend now properly saves uploaded images to `static/uploads/` folder
- ✅ **Public URL Generation**: Images are accessible via `/static/uploads/<filename>` endpoint for D-ID API
- ✅ **D-ID API Configuration**: Added proper voice provider and configuration parameters

### 2. Frontend Issues
- ✅ **FormData Upload**: Fixed `make_mirror.jsx` to send actual file via FormData instead of JSON
- ✅ **Image Persistence**: Image file now persists in state and is available for D-ID API calls
- ✅ **Video Display**: Mirror component now properly displays D-ID generated videos
- ✅ **Image Preview**: Shows uploaded image before video generation
- ✅ **Environment Variables**: Properly configured to use VITE_ prefix for Vite

### 3. Flow Improvements
- ✅ **State Management**: Added videoUrl, imagePreview, isGeneratingVideo states
- ✅ **User Feedback**: Shows loading states and messages during video generation
- ✅ **Error Handling**: Better error messages and console logging
- ✅ **Memory Management**: Proper cleanup of object URLs

## How It Works Now

1. **User uploads image** in `/mirror` endpoint
   - Image is stored in React state
   - Preview is displayed on the right panel
   
2. **User chats with AI**
   - Gemini API handles the conversation
   - After threshold messages, triggers D-ID video generation

3. **Video Generation Triggered**
   - Image file is sent to backend `/talk` endpoint via FormData
   - Backend saves image to `static/uploads/`
   - Backend creates public URL for the image
   - Backend calls D-ID API with image URL and text
   - Backend polls D-ID API until video is ready
   - Returns video URL to frontend

4. **Video Display**
   - Frontend receives video URL
   - Video replaces image preview
   - User can watch their "reflection" speak

## Setup Instructions

### Backend Setup

1. **Install Python dependencies**:
   ```bash
   cd backend
   pip install -r requirement.txt
   ```

2. **Configure .env file**:
   ```env
   # For local development, use ngrok to expose your server
   BASE_URL=https://your-ngrok-url.ngrok.io

   # Get from Google AI Studio
   GEMINI_API_KEY=your_gemini_api_key

   # Get from https://studio.d-id.com/account-settings
   D_ID_API_KEY=your_d_id_api_key
   ```

3. **Important: Use ngrok for local development**
   - D-ID API needs to access your uploaded images via public URL
   - Install ngrok: https://ngrok.com/
   - Run: `ngrok http 5000`
   - Copy the https URL to BASE_URL in .env

4. **Run the backend**:
   ```bash
   python app.py
   ```

### Frontend Setup

1. **Install Node dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure .env file**:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:5000
   ```

3. **Run the frontend**:
   ```bash
   npm run dev
   ```

## D-ID API Details

### Authentication
- Uses Bearer token authentication
- Format: `Authorization: Bearer YOUR_API_KEY`

### Create Talk Endpoint
- **URL**: `https://api.d-id.com/talks`
- **Method**: POST
- **Payload**:
  ```json
  {
    "script": {
      "type": "text",
      "input": "Your text here",
      "provider": {
        "type": "microsoft",
        "voice_id": "en-US-JennyNeural"
      }
    },
    "source_url": "https://public-url-to-image.jpg",
    "config": {
      "fluent": "false",
      "pad_audio": "0.0",
      "stitch": true
    }
  }
  ```

### Get Talk Status
- **URL**: `https://api.d-id.com/talks/{talk_id}`
- **Method**: GET
- **Status values**: "created", "processing", "done", "error"

## Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can upload image in /mirror endpoint
- [ ] Image preview appears after upload
- [ ] Can send chat messages
- [ ] After threshold messages, video generation starts
- [ ] Loading indicator appears during generation
- [ ] Video appears and plays when ready
- [ ] Video has audio and shows the uploaded face speaking

## Common Issues

### Issue: "D-ID cannot access image"
**Solution**: Make sure BASE_URL in backend .env points to your ngrok URL (not localhost)

### Issue: "Video generation fails"
**Solution**: 
- Check D-ID API key is valid
- Verify image is accessible at the public URL
- Check backend console for D-ID API errors

### Issue: "Video doesn't play"
**Solution**: 
- Check browser console for CORS errors
- Verify video URL is valid and accessible
- Try opening video URL directly in browser

### Issue: "Image not persisting"
**Solution**: 
- Verify image file is being uploaded (check Network tab)
- Check backend receives the file
- Verify file is saved in backend/static/uploads/

## Architecture Overview

```
User Upload Image → Frontend State (imageFile)
                  ↓
User Chats → Gemini API (via /knowledge endpoint)
                  ↓
Threshold Reached → mirro_function(imageFile, text)
                  ↓
FormData with image → Backend /talk endpoint
                  ↓
Save to static/uploads/ → Generate public URL
                  ↓
Call D-ID API with image URL + text
                  ↓
Poll until video ready → Return video_url
                  ↓
Frontend displays video
```

## Notes

- Images are saved with UUID prefixes to avoid naming conflicts
- The backend polls D-ID API for up to 60 seconds
- Video URLs from D-ID are typically available for 24 hours
- Frontend uses Vite, so environment variables need VITE_ prefix
