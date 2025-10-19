# Quick Start Guide

## TL;DR - Get Running in 5 Minutes

### 1. Install Dependencies

**Backend:**
```bash
cd backend
pip install -r requirement.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Setup ngrok (Required for D-ID to work)

```bash
# Download ngrok from https://ngrok.com/download
# Or use chocolatey on Windows:
choco install ngrok

# Start ngrok
ngrok http 5000
```

Copy the HTTPS URL (e.g., `https://abcd-1234.ngrok.io`)

### 3. Configure Backend `.env`

Edit `backend/.env`:
```env
BASE_URL=https://abcd-1234.ngrok.io  # Your ngrok URL
GEMINI_API_KEY=AIzaSyBDoM732GX-ZaTWRLGBc3fWjF_BpqIagvU  # Already set
D_ID_API_KEY=c2FtaXJhbmNoYWtyYWJvcnR5MjAwNkBnbWFpbC5jb20:Gd99cRJn7pUBDdHY_lhtC  # Already set
```

**⚠️ IMPORTANT:** Replace the BASE_URL with your ngrok URL!

### 4. Test Backend Setup

```bash
cd backend
python test_setup.py
```

Should show all ✓ checks (BASE_URL warning is OK if using ngrok).

### 5. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Use the Application

1. Open browser to `http://localhost:5173` (or whatever Vite shows)
2. Click "START MISSION"
3. Navigate through to `/mirror` page
4. **Upload your image** (important!)
5. Chat with the AI
6. After ~5-9 messages, video generation will automatically trigger
7. Wait ~30 seconds for D-ID to generate the video
8. Your reflection will appear and speak!

---

## What Was Fixed?

✅ Backend now uses correct D-ID API authentication (Bearer token)
✅ Frontend sends actual image file (not broken JSON)
✅ Image persists across the application
✅ Video is properly displayed when generated
✅ Better error handling and user feedback

---

## Troubleshooting

### "Video generation failed"
- Check backend console for errors
- Verify D-ID API key is valid
- Ensure ngrok is running and BASE_URL is correct

### "Image not uploading"
- Check browser console for errors
- Verify backend is running
- Check frontend .env has correct API URL

### "Video doesn't play"
- Check if video URL is valid (open in new tab)
- Look for CORS errors in console
- Verify D-ID API returned a valid video

---

## Need More Details?

- **Complete documentation:** See `FIXES_AND_SETUP.md`
- **Code changes explained:** See `CODE_CHANGES.md`
- **Backend test script:** Run `backend/test_setup.py`

---

## Important Notes

🔑 **API Keys:** Already configured in your `.env` files
🌐 **ngrok Required:** D-ID needs public URL to access images
⏱️ **Video Generation:** Takes 20-60 seconds
💾 **Storage:** Images saved to `backend/static/uploads/`
🎥 **Video URLs:** Expire after ~24 hours from D-ID
