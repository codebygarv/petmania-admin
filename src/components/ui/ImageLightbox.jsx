import React, { useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageLightbox({ images = [], initialIndex = 0, isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen || !images.length) return null;

  const currentImage = images[currentIndex] || images[0];

  const handleNext = () => {
    setZoom(1);
    setRotation(0);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setZoom(1);
    setRotation(0);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.3, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.3, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
      {/* Top Bar Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <span className="text-sm font-medium text-neutral-300 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
          {currentIndex + 1} / {images.length}
        </span>

        <div className="flex items-center gap-2 bg-neutral-900/80 p-1.5 rounded-xl border border-neutral-800">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={handleRotate}
            className="p-2 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
            title="Rotate"
          >
            <RotateCw size={18} />
          </button>
          <div className="w-px h-6 bg-neutral-800 my-auto" />
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Image Area */}
      <div className="relative w-full h-full flex items-center justify-center p-12 overflow-hidden">
        <img
          src={currentImage}
          alt={`Preview ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain transition-transform duration-200 select-none shadow-2xl"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
          }}
        />
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 p-3 rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors z-10"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 p-3 rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors z-10"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
}
