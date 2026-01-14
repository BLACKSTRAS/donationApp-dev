export const generateVoice = async (
    text: string, 
    refVoiceName: string,
): Promise<string | null> => {
    try {
        const formData = new FormData();
        formData.append("text", text);
        formData.append("ref_voice_name", refVoiceName ?? "temp_short_ref.wav");
        formData.append("speed", "1.0");

        // ยิงไปหา Python API
        const response = await fetch("http://localhost:5000/tts", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            console.error("TTS API Error:", response.statusText);
            return null;
        }

        const arrayBuffer = await response.arrayBuffer();
        
        const buffer = Buffer.from(arrayBuffer);

        const base64Audio = `data:audio/wav;base64,${buffer.toString('base64')}`;

        return base64Audio;

    } catch (error) {
        console.error("Gen Voice Failed:", error);
        return null;
    }
};