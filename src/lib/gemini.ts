
import { GoogleGenerativeAI, Part } from "@google/generative-ai";

// Your API key
const API_KEY = "AIzaSyA_HPQ5HuPaIEYIV-Z54TxQlSkwkFoO16Y";

// Create a client
const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeVehicleImage(imageBase64: string): Promise<string> {
  try {
    // For image input, use the gemini-pro-vision model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Prepare the image data
    const fileData = imageBase64.split(",")[1];
    
    // Create parts for the prompt in Indonesian
    const textPart: Part = {
      text: "Identifikasi kendaraan dalam gambar ini. Berikan informasi berikut dalam Bahasa Indonesia secara deskriptif: 1) Jenis kendaraan (mobil, motor, sepeda, truk, bus, dll), 2) Nama atau model spesifik jika dapat diidentifikasi, 3) Fitur-fitur khusus yang terlihat. Jika bukan kendaraan, jelaskan bahwa ini bukan kendaraan. Buat penjelasan singkat dan jelas dalam paragraf, tanpa menggunakan format JSON."
    };
    
    const imagePart: Part = {
      inlineData: {
        mimeType: "image/jpeg",
        data: fileData
      }
    };

    // Generate content
    const result = await model.generateContent([textPart, imagePart]);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing image:", error);
    return "Maaf, saya tidak dapat menganalisis gambar ini dengan baik. Mohon coba lagi dengan gambar yang lebih jelas.";
  }
}
