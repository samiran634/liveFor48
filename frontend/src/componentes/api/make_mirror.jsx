const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

/**
 * Upload image once to D-ID and get a reusable URL
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<string>} The D-ID image URL
 */
export async function uploadImageToDID(imageFile) {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const response = await fetch(`${API_BASE_URL}/mirror/upload-image`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to upload image to D-ID");
        }

        const data = await response.json();
        return data.image_url; // Return the D-ID URL
    } catch(e) {
        console.error("Error uploading image to D-ID:", e);
        throw e;
    }
}

/**
 * Generate video using pre-uploaded D-ID image URL
 * @param {string} imageUrl - The D-ID image URL (from uploadImageToDID)
 * @param {string} text - The text to speak
 * @returns {Promise<Object>} Object containing video_url
 */
export async function mirro_function(imageUrl, text) {
    try {
        const response = await fetch(`${API_BASE_URL}/talk`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                image_url: imageUrl,
                text: text
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "The AI is refusing to respond.");
        }

        const data = await response.json();
        return data;
    } catch(e) {
        console.error("Error generating video:", e);
        throw e;
    }
}