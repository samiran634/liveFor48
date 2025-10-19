export async function mirro_function (imageFile, text){
    try{
        
    const response = await fetch(`${API_BASE_URL}/talk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `${text}${extraPrompt}`,
        source_url:imageFile
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "The AI is refusing to respond.");
    }

    const data = await response.json();
    return data
    }catch(e){
        console.log("error occoured",e);
    }
}