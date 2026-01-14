import React, { useRef, useEffect, useState } from 'react';
import { Eraser, Check } from 'lucide-react';

const SignaturePad = ({ onSave, label }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size based on container
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = 150; // Fixed height
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX || event.touches[0].clientX) - rect.left;
    const y = (event.clientY || event.touches[0].clientY) - rect.top;
    return { x, y };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveSignature();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSave(null);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (hasSignature) {
      const dataUrl = canvas.toDataURL();
      onSave(dataUrl);
    }
  };

  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="relative border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-[150px] cursor-crosshair rounded-lg"
        />
        
        <button
          type="button"
          onClick={clearCanvas}
          className="absolute top-2 right-2 p-1 bg-white shadow-sm rounded-md border border-slate-200 hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors"
          title="Hapus Tanda Tangan"
        >
          <Eraser size={16} />
        </button>
      </div>
      <p className="text-xs text-slate-400 mt-1 italic">Tanda tangan pada kotak di atas</p>
    </div>
  );
};

export default SignaturePad;