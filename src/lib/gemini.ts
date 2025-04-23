
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
      text: `Identifikasi kendaraan dalam gambar ini dan berikan informasi berikut dalam Bahasa Indonesia:

1. Jenis Kendaraan:
   - Bermotor atau Non-motor
   - Kategori spesifik (mobil, motor, sepeda, dll)

2. Merk Kendaraan:
   - Nama produsen/merk
   - Model spesifik (jika terlihat)

3. Fitur Utama:
   - 3-4 fitur paling mencolok
   - Warna dominan
   - Karakteristik khusus

Berikan penjelasan dalam format yang mudah dibaca, tanpa menggunakan format teknis seperti JSON. Gunakan bahasa yang sederhana dan mudah dimengerti.`
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

/**
 * Fungsi untuk pertanyaan sederhana berbahasa Indonesia (siapa, kapan, penjumlahan, dll)
 * Menghasilkan jawaban ringkas, mudah dimengerti, dan tanpa format teknis.
 */
export async function askIndonesianQuestion(question: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Jawablah pertanyaan berikut dalam bahasa Indonesia yang sederhana, jelas, dan mudah dimengerti. Hindari menggunakan format teknis seperti kode, JSON, atau tabel dalam jawabanmu. Jika pertanyaan berupa operasi matematika sederhana, berikan jawabannya dan langkahnya secara singkat.

Pertanyaan: "${question}"
Jawaban:`;

    const result = await model.generateContent([
      { text: prompt }
    ]);

    return result.response.text();
  } catch (error) {
    console.error("Error answering Indonesian question:", error);
    return "Maaf, saya tidak dapat menjawab pertanyaan tersebut saat ini.";
  }
}
