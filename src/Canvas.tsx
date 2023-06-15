import React, { useEffect, useRef } from "react";

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        // 在这里可以使用上下文对象进行绘图操作
        context.beginPath();
        context.moveTo(50, 140);
        context.lineTo(150, 60);
        context.closePath();
        context.stroke();
      }
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="myCanvas"
      className="m-auto w-9/12 h-2/4 bg-[#242424] border-2 border-[#ebffb5] rounded-md"
    ></canvas>
  );
};

export default Canvas;
