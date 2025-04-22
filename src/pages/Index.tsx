
import { ChatInterface } from "@/components/ChatInterface";
import { RadarAnimation, BackgroundGrid } from "@/components/FuturisticElements";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative">
      <BackgroundGrid />
      
      {/* Header */}
      <header className="p-6 text-center relative z-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="hidden md:block">
            <RadarAnimation />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Vehicle Vision AI
          </h1>
        </div>
        <p className="text-blue-200 max-w-md mx-auto">
          Upload any image of a vehicle and our AI will identify it
        </p>
      </header>
      
      {/* Main content */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 pb-8 relative z-10">
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/4 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
          
          {/* Chat interface */}
          <div className="relative z-10 backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">Vehicle Detection System</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-5 bg-blue-300/50 rounded-full"></div>
                <div className="h-1 w-3 bg-blue-300/30 rounded-full"></div>
                <div className="h-1 w-2 bg-blue-300/20 rounded-full"></div>
              </div>
            </div>
            
            <ChatInterface />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="text-center py-4 text-blue-300/70 text-sm relative z-10">
        <p>Powered by Gemini AI • Vehicle Vision Detection System</p>
      </footer>
    </div>
  );
};

export default Index;
