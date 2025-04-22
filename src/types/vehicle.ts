
export interface VehicleAnalysis {
  vehicleType: string;
  modelName: string;
  features: string[];
  confidence: 'high' | 'medium' | 'low' | 'none';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  vehicleAnalysis?: VehicleAnalysis;
}
