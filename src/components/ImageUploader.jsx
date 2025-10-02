import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImageSrc, resetTransform } from "../store/imageSlice";

export default function ImageUploader() {
  const dispatch = useDispatch();
  const imageSrc = useSelector((state) => state.image.src);
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      dispatch(setImageSrc(event.target.result));
      dispatch(resetTransform());
    };
    reader.readAsDataURL(file);
    
    // Reset input value
    e.target.value = '';
  };

  const handleReset = () => {
    dispatch(resetTransform());
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFile}
        style={{ display: "none" }}
      />
      
      <button
        onClick={handleFileClick}
        style={{
          padding: "8px 16px",
          backgroundColor: "#4A90E2",
          color: "#ffffff",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
          border: "none"
        }}
      >
        Upload Image
      </button>
      
      <button
        onClick={handleReset}
        disabled={!imageSrc}
        style={{
          padding: "8px 16px",
          backgroundColor: imageSrc ? "#f0f0f0" : "#e5e5e5",
          color: imageSrc ? "#333" : "#999",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: "500",
          cursor: imageSrc ? "pointer" : "not-allowed",
          border: "none"
        }}
      >
        Reset
      </button>
    </div>
  );
}