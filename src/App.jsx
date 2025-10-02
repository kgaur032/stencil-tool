import React from "react";
import CanvasEditor from "./components/CanvasEditor";
import FrameSidebar from "./components/FrameSidebar";
import ImageUploader from "./components/ImageUploader";

export default function App() {
  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      backgroundColor: "#f5f5f5",
      overflow: "hidden" 
    }}>
      {/* Left Sidebar - Frame Selection */}
      <FrameSidebar />
      
      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Top Toolbar */}
        <div style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <h1 style={{ 
            fontSize: "18px", 
            fontWeight: "600",
            color: "#333",
            flex: 1
          }}>
            Canvas Stencil Editor
          </h1>
          <ImageUploader />
        </div>

        {/* Canvas Area */}
        <div style={{ 
          flex: 1, 
          overflow: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <CanvasEditor width={700} height={500} />
        </div>
      </div>
    </div>
  );
}