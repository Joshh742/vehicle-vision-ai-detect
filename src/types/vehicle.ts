
export interface VehicleAnalysis {
  jenisKendaraan: string;
  namaModel: string;
  fiturKhusus: string[];
  tingkatKeyakinan: 'tinggi' | 'sedang' | 'rendah' | 'tidak ada';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  vehicleAnalysis?: VehicleAnalysis;
}

