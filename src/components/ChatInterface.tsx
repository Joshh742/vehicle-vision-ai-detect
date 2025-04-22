
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { analyzeVehicleImage } from "@/lib/gemini";
import { ChatMessage, VehicleAnalysis } from "@/types/vehicle";
import { Send, Upload, Car, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Upload an image of a vehicle, and I'll identify what it is!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processVehicleImage = async () => {
    if (!selectedImage) return;
    
    // Add user message with image
    const userMsgId = Date.now().toString();
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: inputValue || "Analyze this vehicle",
      timestamp: new Date(),
      imageUrl: selectedImage
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsProcessing(true);
    
    try {
      // Process with Gemini API
      const analysisResult = await analyzeVehicleImage(selectedImage);
      let vehicleData: VehicleAnalysis;
      
      try {
        vehicleData = JSON.parse(analysisResult) as VehicleAnalysis;
      } catch (e) {
        // If not valid JSON, create a structured response
        vehicleData = {
          vehicleType: "Unknown",
          modelName: "Unidentified",
          features: [analysisResult],
          confidence: "low"
        };
      }
      
      // Add assistant response
      const responseContent = generateResponseMessage(vehicleData);
      const assistantMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        vehicleAnalysis: vehicleData
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Error processing image:", error);
      
      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error analyzing this image. Please try again with a clearer image.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
      clearSelectedImage();
    }
  };

  const handleSendMessage = () => {
    if (selectedImage) {
      processVehicleImage();
    } else if (inputValue.trim()) {
      // Just a text message without image
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: inputValue,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMsg]);
      
      // Simple response for text-only queries
      setTimeout(() => {
        const assistantMsg: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: "To identify a vehicle, please upload an image of it!",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMsg]);
      }, 500);
      
      setInputValue("");
    }
  };

  const generateResponseMessage = (analysis: VehicleAnalysis): string => {
    if (analysis.vehicleType.toLowerCase() === "error") {
      return "I couldn't analyze this image properly. Please try again with a clearer image.";
    }
    
    if (analysis.vehicleType.toLowerCase() === "not a vehicle") {
      return "This doesn't appear to be a vehicle. Please upload an image of a vehicle for analysis.";
    }
    
    const features = analysis.features && analysis.features.length > 0 
      ? `\n\nDistinctive features: ${analysis.features.join(", ")}`
      : "";
    
    return `I've identified this as a ${analysis.vehicleType}.\n${analysis.modelName ? `Model: ${analysis.modelName}` : ""}${features}\n\nConfidence: ${analysis.confidence}`;
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-3xl mx-auto">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/5 rounded-lg backdrop-blur-sm">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex flex-col max-w-[80%] rounded-2xl p-4",
              message.role === "user" 
                ? "ml-auto bg-blue-500 text-white" 
                : "mr-auto bg-white/90 dark:bg-gray-800/90 shadow-lg"
            )}
          >
            {message.imageUrl && (
              <div className="mb-2">
                <img 
                  src={message.imageUrl} 
                  alt="Uploaded vehicle" 
                  className="rounded-lg max-h-60 object-cover" 
                />
              </div>
            )}
            
            <p className="whitespace-pre-wrap">{message.content}</p>
            
            {message.vehicleAnalysis && message.vehicleAnalysis.vehicleType !== "Error" && (
              <Card className="mt-3 p-2 bg-blue-50 dark:bg-gray-700/50">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Car size={16} />
                  <span>{message.vehicleAnalysis.vehicleType}</span>
                  {message.vehicleAnalysis.modelName && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-gray-600 text-xs">
                      {message.vehicleAnalysis.modelName}
                    </span>
                  )}
                </div>
                
                {message.vehicleAnalysis.features && message.vehicleAnalysis.features.length > 0 && (
                  <div className="mt-1 text-xs">
                    <div className="flex flex-wrap gap-1 mt-1">
                      {message.vehicleAnalysis.features.map((feature, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}
            
            <span className="text-xs opacity-70 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Image upload area */}
      {selectedImage && (
        <div className="relative mt-4 mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 bg-black/50 text-white rounded-full p-1"
            onClick={clearSelectedImage}
          >
            <X size={16} />
          </Button>
          <img 
            src={selectedImage} 
            alt="Selected" 
            className="w-full h-32 object-cover rounded-lg" 
          />
        </div>
      )}
      
      {/* Input area */}
      <div className="mt-4 flex gap-2 items-end">
        <div
          className={cn(
            "relative flex-1",
            dragActive ? "ring-2 ring-blue-400" : ""
          )}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about the vehicle or upload an image..."
            className="pr-10 resize-none h-[60px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <div className="absolute right-2 bottom-2">
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Upload size={18} className="opacity-70" />
              </div>
            </label>
            <input
              id="image-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>
        
        <Button 
          onClick={handleSendMessage}
          disabled={isProcessing}
          className="rounded-full aspect-square"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
}
