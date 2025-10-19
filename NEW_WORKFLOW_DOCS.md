# New Image Upload Workflow Documentation

## Overview

The application now uses a **two-step process** for D-ID video generation:

1. **Upload image once** to D-ID and get a permanent URL
2. **Reuse that URL** for all subsequent video generations

This is more efficient and follows D-ID best practices.

---

## Backend Changes

### New Endpoint: `/mirror/upload-image`

**Purpose:** Upload image to D-ID and return a permanent URL for reuse

**Method:** POST

**Content-Type:** multipart/form-data

**Request:**
```
FormData {
  image: File (blob)
}
```

**Response:**
```json
{
  "image_url": "https://d-id.com/images/xxx",
  "local_path": "uuid_filename.jpg"
}
```

**Implementation:**
```python
@app.route("/mirror/upload-image", methods=["POST"])
def upload_image_to_did():
    # 1. Receive image file from frontend
    # 2. Save temporarily to static/uploads/
    # 3. Upload to D-ID using /images endpoint
    # 4. Return D-ID URL for reuse
```

### Updated Endpoint: `/talk`

**Purpose:** Generate video using pre-uploaded D-ID image URL

**Method:** POST

**Content-Type:** application/json

**Request:**
```json
{
  "image_url": "https://d-id.com/images/xxx",
  "text": "Your text to speak"
}
```

**Response:**
```json
{
  "video_url": "https://d-id.com/talks/result.mp4"
}
```

**Changes:**
- ❌ Before: Accepted FormData with image file
- ✅ Now: Accepts JSON with image_url

### New Helper Function: `upload_image_to_did_api()`

**Purpose:** Upload image file to D-ID's `/images` endpoint

**D-ID Images API:**
- Endpoint: `https://api.d-id.com/images`
- Method: POST
- Auth: Bearer token
- Body: multipart/form-data with 'image' field
- Returns: `{ "url": "https://d-id.com/images/xxx" }`

---

## Frontend Changes

### Updated File: `make_mirror.jsx`

Now exports two functions:

#### 1. `uploadImageToDID(imageFile)`

**Purpose:** Upload image once and get D-ID URL

**Parameters:**
- `imageFile` (File): The image file to upload

**Returns:** 
- Promise<string>: D-ID image URL

**Usage:**
```javascript
const didUrl = await uploadImageToDID(imageFile);
// Returns: "https://d-id.com/images/xxx"
```

#### 2. `mirro_function(imageUrl, text)`

**Purpose:** Generate video using stored D-ID URL

**Parameters:**
- `imageUrl` (string): D-ID image URL from uploadImageToDID
- `text` (string): Text to speak

**Returns:**
- Promise<Object>: `{ video_url: "..." }`

**Usage:**
```javascript
const result = await mirro_function(didUrl, "Hello world");
// Returns: { video_url: "https://..." }
```

### Updated File: `mirror.jsx`

**New State:**
```javascript
const [didImageUrl, setDidImageUrl] = useState(null); // Store D-ID URL
const [isUploadingImage, setIsUploadingImage] = useState(false); // Upload status
```

**Updated `handleImage()` Flow:**
1. User selects image
2. Create local preview
3. **Immediately upload to D-ID**
4. Store D-ID URL in state
5. Enable chat (only when URL is ready)

**Updated `handleSubmit()` Flow:**
1. User sends message
2. AI responds via Gemini
3. When threshold reached, trigger video generation
4. **Use stored D-ID URL** (not file upload)
5. Display generated video

**UI Changes:**
- Upload button shows "⏳ Uploading to D-ID..." during upload
- Chat disabled until D-ID URL is ready
- Better status indicators

### Updated File: `replies.jsx`

**Parameter Change:**
```javascript
// Before:
getKnowledgeReply(text, history, callback, imageFile)

// After:
getKnowledgeReply(text, history, callback, didImageUrl)
```

Now passes D-ID URL instead of File object.

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER UPLOADS IMAGE                                       │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. FRONTEND (mirror.jsx)                                    │
│    - Store file in state                                    │
│    - Create preview URL                                     │
│    - Call uploadImageToDID(file)                            │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. BACKEND (POST /mirror/upload-image)                      │
│    - Save file to static/uploads/                           │
│    - Call D-ID /images API                                  │
│    - Return D-ID URL                                        │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. FRONTEND (mirror.jsx)                                    │
│    - Store D-ID URL in state                                │
│    - Enable chat                                            │
│    - Show "Ready" status                                    │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. USER CHATS (Multiple Messages)                           │
│    - Gemini API handles conversation                        │
│    - Each message uses stored D-ID URL                      │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. THRESHOLD REACHED                                         │
│    - Trigger video generation                               │
│    - Call mirro_function(didImageUrl, text)                 │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. BACKEND (POST /talk)                                     │
│    - Receive image_url + text (JSON)                        │
│    - Call D-ID /talks API with image_url                    │
│    - Poll until video ready                                 │
│    - Return video_url                                       │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. FRONTEND (mirror.jsx)                                    │
│    - Display video                                          │
│    - Continue chat (can generate more videos)               │
│    - All using same D-ID image URL                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Benefits

### 1. **Efficiency**
- Image uploaded to D-ID only once
- No repeated file transfers for each video
- Faster video generation

### 2. **D-ID Best Practice**
- Uses dedicated `/images` endpoint
- Follows recommended workflow
- Better rate limit management

### 3. **Better UX**
- Clear upload status
- Chat enabled only when ready
- Reuse same image for multiple videos

### 4. **Network Optimization**
- Smaller payload for video generation
- No need to re-upload 5MB image each time
- Faster API calls

---

## Testing the New Workflow

### 1. Start Backend
```bash
cd backend
python app.py
```

### 2. Test Image Upload Endpoint
```bash
curl -X POST http://127.0.0.1:5000/mirror/upload-image \
  -F "image=@test.jpg"
```

**Expected Response:**
```json
{
  "image_url": "https://create-images-results.d-id.com/...",
  "local_path": "uuid_filename.jpg"
}
```

### 3. Test Video Generation with URL
```bash
curl -X POST http://127.0.0.1:5000/talk \
  -H "Content-Type: application/json" \
  -d '{"image_url": "https://create-images-results.d-id.com/...", "text": "Hello"}'
```

**Expected Response:**
```json
{
  "video_url": "https://d-id-talks-prod.s3.us-west-2.amazonaws.com/..."
}
```

### 4. Test Frontend
1. Navigate to `/mirror`
2. Upload image
3. **Wait for "✅ Ready" status**
4. Send chat messages
5. Video should generate using stored URL

---

## Migration Notes

### From Old Workflow

**Old:**
```javascript
// Upload image with every video generation
mirro_function(imageFile, text) → video_url
```

**New:**
```javascript
// Upload once
const didUrl = await uploadImageToDID(imageFile);

// Generate multiple videos
await mirro_function(didUrl, text1) → video1
await mirro_function(didUrl, text2) → video2
await mirro_function(didUrl, text3) → video3
```

### Breaking Changes

1. `/talk` endpoint no longer accepts FormData
2. Must upload image first via `/mirror/upload-image`
3. `mirro_function()` signature changed from `(file, text)` to `(url, text)`

---

## Troubleshooting

### Issue: "Image upload fails"

**Check:**
- D-ID API key is valid
- Image file is valid (JPG, PNG)
- File size under D-ID limits
- Backend can reach D-ID API

**Debug:**
```python
# Add logging in backend
print(f"Uploading file: {filepath}")
print(f"D-ID response: {response.text}")
```

### Issue: "Chat disabled after upload"

**Check:**
- `didImageUrl` state is set
- No errors in console
- Upload completed successfully

**Debug:**
```javascript
// Add in handleImage
console.log("D-ID URL:", didUrl);
console.log("State updated:", didImageUrl);
```

### Issue: "Video generation fails"

**Check:**
- `image_url` is valid D-ID URL
- URL not expired
- D-ID API credits available

**Debug:**
```javascript
// Check what's being sent
console.log("Sending to /talk:", { image_url: imageUrl, text });
```

---

## API Limits & Quotas

### D-ID `/images` Endpoint
- **Rate Limit:** Check your plan
- **File Size:** Max 5MB recommended
- **Formats:** JPG, PNG
- **URL Expiry:** 24 hours (check D-ID docs)

### D-ID `/talks` Endpoint
- **Rate Limit:** Check your plan
- **Video Length:** Max 5 minutes
- **Concurrent:** Limited by plan

---

## Future Enhancements

1. **Cache Management**
   - Store D-ID URL in localStorage
   - Persist across page refreshes
   - Implement expiry handling

2. **Multiple Images**
   - Support uploading multiple faces
   - Switch between stored URLs
   - Gallery view

3. **Image Editing**
   - Crop/resize before upload
   - Filters and effects
   - Face detection

4. **Error Recovery**
   - Retry failed uploads
   - Fallback to local storage
   - Graceful degradation

---

## Security Considerations

1. **URL Storage**
   - D-ID URLs are public
   - Anyone with URL can access image
   - Consider privacy implications

2. **Rate Limiting**
   - Add backend rate limits
   - Prevent upload spam
   - Track usage per user

3. **File Validation**
   - Validate file types
   - Check file size
   - Scan for malicious content

4. **API Keys**
   - Never expose D-ID key to frontend
   - Use environment variables
   - Rotate keys regularly
