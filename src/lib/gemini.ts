
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
    
    // Create parts for the prompt
    const textPart: Part = {
      text: "Identify this vehicle in the image. Please provide: 1) The exact type of vehicle (car, motorcycle, bicycle, truck, bus, etc.), 2) The specific name or model if identifiable, 3) Any distinctive features. If it's not a vehicle, clearly state that it's not a vehicle. Respond in JSON format with fields: vehicleType, modelName, features, and confidence (high/medium/low). Keep the response concise."
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
    return JSON.stringify({
      vehicleType: "Error",
      modelName: "Unable to analyze image",
      features: [],
      confidence: "none"
    });
  }
}
