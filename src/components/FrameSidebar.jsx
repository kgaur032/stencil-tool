import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedFrame } from "../store/imageSlice";

const frames = [
  {
    id: 'classic-brown',
    name: 'Classic Frame',
    category: 'Paper',
    borderWidth: 20,
    borderColor: '#8B6F47',
    innerBorder: '#654321',
    shadowColor: 'rgba(0,0,0,0.3)',
    rx: 20,
    ry: 20
  },
  {
    id: 'modern-white',
    name: 'Modern White',
    category: 'Paper',
    borderWidth: 15,
    borderColor: '#FFFFFF',
    innerBorder: '#E0E0E0',
    shadowColor: 'rgba(0,0,0,0.2)',
    rx: 10,
    ry: 10
  },
  {
    id: 'vintage-gold',
    name: 'Vintage Gold',
    category: 'Flowers',
    borderWidth: 25,
    borderColor: '#D4AF37',
    innerBorder: '#B8922E',
    shadowColor: 'rgba(0,0,0,0.4)',
    rx: 15,
    ry: 15
  },
  {
    id: 'minimal-black',
    name: 'Minimal Black',
    category: 'Devices',
    borderWidth: 12,
    borderColor: '#2C2C2C',
    innerBorder: '#000000',
    shadowColor: 'rgba(0,0,0,0.5)',
    rx: 5,
    ry: 5
  },
  {
    id: 'pastel-blue',
    name: 'Pastel Blue',
    category: 'Blob',
    borderWidth: 18,
    borderColor: '#A8D8EA',
    innerBorder: '#7CB4CC',
    shadowColor: 'rgba(0,0,0,0.2)',
    rx: 25,
    ry: 25
  },
  {
    id: 'natural-wood',
    name: 'Natural Wood',
    category: 'Paper',
    borderWidth: 22,
    borderColor: '#C19A6B',
    innerBorder: '#8B7355',
    shadowColor: 'rgba(0,0,0,0.3)',
    rx: 12,
    ry: 12
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    category: 'Flowers',
    borderWidth: 16,
    borderColor: '#E0BFB8',
    innerBorder: '#C9ADA7',
    shadowColor: 'rgba(0,0,0,0.25)',
    rx: 18,
    ry: 18
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    category: 'Blob',
    borderWidth: 20,
    borderColor: '#4A90E2',
    innerBorder: '#357ABD',
    shadowColor: 'rgba(0,0,0,0.3)',
    rx: 30,
    ry: 30
  },
];

const categories = ['All', 'Paper', 'Devices', 'Flowers', 'Blob'];

export default function FrameSidebar() {
  const dispatch = useDispatch();
  const selectedFrame = useSelector((state) => state.image.selectedFrame);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFrames = selectedCategory === 'All'
    ? frames
    : frames.filter(f => f.category === selectedCategory);

  const handleFrameSelect = (frame) => {
    dispatch(setSelectedFrame(frame));
  };

  return (
    <div style={{
      width: "280px",
      backgroundColor: "#ffffff",
      borderRight: "1px solid #e0e0e0",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{ padding: "16px" }}>
        <h2 style={{ 
          fontSize: "16px", 
          fontWeight: "600", 
          marginBottom: "16px",
          color: "#333"
        }}>
          Frames
        </h2>

        {/* Category Filter */}
        <div style={{ 
          display: "flex", 
          gap: "6px", 
          marginBottom: "16px",
          flexWrap: "wrap"
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "6px 12px",
                borderRadius: "16px",
                fontSize: "12px",
                fontWeight: "500",
                backgroundColor: selectedCategory === cat ? "#4A90E2" : "#f0f0f0",
                color: selectedCategory === cat ? "#ffffff" : "#666",
                transition: "all 0.2s",
                border: "none",
                cursor: "pointer"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Frame Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px"
        }}>
          {filteredFrames.map(frame => (
            <button
              key={frame.id}
              onClick={() => handleFrameSelect(frame)}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: selectedFrame.id === frame.id 
                  ? "2px solid #4A90E2" 
                  : "2px solid #e0e0e0",
                backgroundColor: selectedFrame.id === frame.id 
                  ? "#EBF5FF" 
                  : "#ffffff",
                transition: "all 0.2s",
                cursor: "pointer"
              }}
            >
              <div style={{
                width: "100%",
                aspectRatio: "4/3",
                borderRadius: `${frame.rx / 4}px`,
                backgroundColor: "#f8f8f8",
                border: `${frame.borderWidth / 3}px solid ${frame.borderColor}`,
                boxShadow: `inset 0 0 0 ${frame.borderWidth / 6}px ${frame.innerBorder}`,
                marginBottom: "8px"
              }} />
              <p style={{
                fontSize: "11px",
                color: "#666",
                textAlign: "center",
                fontWeight: "500"
              }}>
                {frame.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}