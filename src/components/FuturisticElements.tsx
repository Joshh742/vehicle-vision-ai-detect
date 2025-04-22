
import { useEffect, useRef } from 'react';

export const RadarAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let angle = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(centerX, centerY) - 10;
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw outer circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw inner circles
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius * (i / 4), 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw scanning line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle) * outerRadius,
        centerY + Math.sin(angle) * outerRadius
      );
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw semi-transparent scanning area
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, outerRadius, angle - 0.2, angle);
      ctx.fillStyle = 'rgba(79, 70, 229, 0.1)';
      ctx.fill();
      
      // Draw dots randomly in the radar area
      for (let i = 0; i < 5; i++) {
        const randomAngle = Math.random() * Math.PI * 2;
        const randomRadius = Math.random() * outerRadius;
        const dotX = centerX + Math.cos(randomAngle) * randomRadius;
        const dotY = centerY + Math.sin(randomAngle) * randomRadius;
        
        const opacity = Math.random() * 0.5 + 0.2;
        const size = Math.random() * 3 + 1;
        
        ctx.beginPath();
        ctx.arc(dotX, dotY, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${opacity})`;
        ctx.fill();
      }
      
      angle += 0.03;
      requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={120} 
      height={120} 
      className="opacity-70"
    />
  );
};

export const BackgroundGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '-1px -1px'
        }}
      />
    </div>
  );
};
