import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { useSelector, useDispatch } from "react-redux";
import { setTransform, resetTransform } from "../store/imageSlice";

export default function CanvasEditor({ width = 700, height = 500 }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const imgObjectRef = useRef(null);
  const stencilRef = useRef(null);
  const frameObjectsRef = useRef([]);
  
  const dispatch = useDispatch();
  const imageSrc = useSelector((s) => s.image.src);
  const transform = useSelector((s) => s.image.transform);
  const selectedFrame = useSelector((s) => s.image.selectedFrame);

  // Initialize canvas
  useEffect(() => {
    const canvas = new fabric.Canvas("stencil-canvas", {
      width,
      height,
      selection: false,
      preserveObjectStacking: true,
      allowTouchScrolling: true,
    });
    fabricRef.current = canvas;

    canvas.setBackgroundColor("#f7f7f7", canvas.renderAll.bind(canvas));

    return () => {
      canvas.dispose();
    };
  }, [width, height]);

  // Helper function to constrain image
  function constrainImageToStencil(img, stencil) {
    if (!img || !stencil) return;

    const imgRect = img.getBoundingRect(true);
    const stencilRect = stencil.getBoundingRect(true);

    let dx = 0, dy = 0;

    if (imgRect.left > stencilRect.left) {
      dx = stencilRect.left - imgRect.left;
    } else if (imgRect.left + imgRect.width < stencilRect.left + stencilRect.width) {
      dx = stencilRect.left + stencilRect.width - (imgRect.left + imgRect.width);
    }

    if (imgRect.top > stencilRect.top) {
      dy = stencilRect.top - imgRect.top;
    } else if (imgRect.top + imgRect.height < stencilRect.top + stencilRect.height) {
      dy = stencilRect.top + stencilRect.height - (imgRect.top + imgRect.height);
    }

    if (dx !== 0 || dy !== 0) {
      img.left += dx;
      img.top += dy;
      img.setCoords();
    }
  }

  // Update frame when selectedFrame changes
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Remove old frame objects
    frameObjectsRef.current.forEach(obj => canvas.remove(obj));
    frameObjectsRef.current = [];

    // Calculate frame dimensions
    const frameW = Math.min(width - 100, 500);
    const frameH = Math.min(height - 100, 400);
    const left = (width - frameW) / 2;
    const top = (height - frameH) / 2;

    const borderW = selectedFrame.borderWidth;

    // Outer frame (decorative)
    const outerFrame = new fabric.Rect({
      left: left - borderW,
      top: top - borderW,
      width: frameW + borderW * 2,
      height: frameH + borderW * 2,
      rx: selectedFrame.rx,
      ry: selectedFrame.ry,
      fill: selectedFrame.borderColor,
      selectable: false,
      evented: false,
      shadow: new fabric.Shadow({
        color: selectedFrame.shadowColor,
        blur: 20,
        offsetX: 3,
        offsetY: 3,
      }),
    });

    // Inner border
    const innerFrame = new fabric.Rect({
      left: left - borderW / 2,
      top: top - borderW / 2,
      width: frameW + borderW,
      height: frameH + borderW,
      rx: selectedFrame.rx * 0.8,
      ry: selectedFrame.ry * 0.8,
      fill: selectedFrame.innerBorder,
      selectable: false,
      evented: false,
    });

    // Inner white area (stencil)
    const stencil = new fabric.Rect({
      left,
      top,
      width: frameW,
      height: frameH,
      rx: selectedFrame.rx * 0.6,
      ry: selectedFrame.ry * 0.6,
      selectable: false,
      evented: false,
      fill: "#ffffff",
      stroke: "#e0e0e0",
      strokeWidth: 1,
    });

    stencilRef.current = stencil;
    frameObjectsRef.current = [outerFrame, innerFrame, stencil];

    canvas.add(outerFrame);
    canvas.add(innerFrame);
    canvas.add(stencil);

    // Update image clip path if image exists
// Update image clip path if image exists
if (imgObjectRef.current) {
    const img = imgObjectRef.current;
  
    const clipRect = new fabric.Rect({
      left: stencil.left,
      top: stencil.top,
      width: stencil.width,
      height: stencil.height,
      rx: stencil.rx,
      ry: stencil.ry,
      absolutePositioned: true,
    });
    img.clipPath = clipRect;
  
    // ✅ Sirf tabhi re-fit karo jab image first time load hua ho ya reset kiya ho
    if (!transform || transform.reset) {
      const scale = Math.max(stencil.width / img.width, stencil.height / img.height);
      img.set({
        left: stencil.left,
        top: stencil.top,
        scaleX: scale,
        scaleY: scale,
      });
      img.setCoords();
  
      dispatch(setTransform({
        left: img.left,
        top: img.top,
        scaleX: img.scaleX,
        scaleY: img.scaleY,
        angle: img.angle || 0,
      }));
    }
  
    // Image ko frame ke neeche nahi chhupne dena
    canvas.bringToFront(img);
  }

  }, [selectedFrame, width, height, dispatch]);

  // Load image when imageSrc changes
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const stencil = stencilRef.current;

    if (imgObjectRef.current) {
     canvas.remove(imgObjectRef.current);
      imgObjectRef.current = null;
    }

    if (!imageSrc || !stencil) {
      canvas.requestRenderAll();
      return;
    }

    fabric.Image.fromURL(imageSrc, (img) => {
      const sW = stencil.width;
      const sH = stencil.height;
      const scale = Math.max(sW / img.width, sH / img.height);

      img.set({
        left: stencil.left,
        top: stencil.top,
        originX: "left",
        originY: "top",
        scaleX: scale,
        scaleY: scale,
        hasBorders: false,
        cornerStyle: "circle",
        transparentCorners: false,
      });

      const clipRect = new fabric.Rect({
        left: stencil.left,
        top: stencil.top,
        width: stencil.width,
        height: stencil.height,
        rx: stencil.rx,
        ry: stencil.ry,
        absolutePositioned: true,
      });

      img.clipPath = clipRect;

      img.setControlsVisibility({
        mt: false,
        mb: false,
        ml: false,
        mr: false,
      });

      imgObjectRef.current = img;
      canvas.add(img);

      // <<< CHANGED: bring image in front and only bring outer/inner frames above it.
      // This prevents the stencil (white inner rect) from being placed over the image.
      // Previously you brought all frame objects to front which made the stencil hide the image.
      frameObjectsRef.current.forEach(obj => {
        if (!obj) return;
        // 'stencil' variable refers to stencilRef.current above
        if (obj !== stencil) {
          canvas.bringToFront(obj); // outerFrame and innerFrame stay on top
        }
      });
      canvas.bringToFront(img);
      // <<< END CHANGE

      img.set({
        selectable: true,
        evented: true,
      });

      canvas.on("object:moving", (e) => {
        if (e.target === img) {
          // Do not constrain continuously to avoid flicker
          // Only ensure clipPath moves with image
          if (img.clipPath) {
            img.clipPath.left = stencil.left;
            img.clipPath.top = stencil.top;
          }
        }
      });
      
      

      canvas.on("object:scaling", (e) => {
        if (e.target === img) {
          canvas.requestRenderAll();
        }
      });
      
      canvas.on("object:modified", (e) => {
        if (e.target === img) {
          constrainImageToStencil(img, stencil);
      
          if (img.clipPath) {
            img.clipPath.left = stencil.left;
            img.clipPath.top = stencil.top;
          }
      
          img.setCoords();
          dispatch(setTransform({
            left: img.left,
            top: img.top,
            scaleX: img.scaleX,
            scaleY: img.scaleY,
            angle: img.angle || 0,
          }));
      
          fabricRef.current.requestRenderAll();
        }
      });
      
      
      
      canvas.on("object:modified", (e) => {
        if (e.target === img) {
          constrainImageToStencil(img, stencil); // scale/move complete hone par apply karo
          dispatch(setTransform({
            left: img.left,
            top: img.top,
            scaleX: img.scaleX,
            scaleY: img.scaleY,
            angle: img.angle || 0,
          }));
          canvas.requestRenderAll();
        }
      });
      

      dispatch(setTransform({
        left: img.left,
        top: img.top,
        scaleX: img.scaleX,
        scaleY: img.scaleY,
        angle: img.angle || 0,
      }));

      canvas.requestRenderAll();
    }, { crossOrigin: "anonymous" });
  }, [imageSrc, dispatch]);

  // ✅ REMOVED: Reset button handler useEffect (lines 284-308)
  // Reset functionality is now handled in ImageUploader.jsx via Redux

  // Sync transform from Redux
  useEffect(() => {
    const img = imgObjectRef.current;
    if (!img || !transform) return;
    
    img.set({
      left: transform.left,
      top: transform.top,
      scaleX: transform.scaleX,
      scaleY: transform.scaleY,
      angle: transform.angle || 0,
    });
    img.setCoords();
    fabricRef.current.requestRenderAll();
  }, [transform]);

  return (
    <div style={{
      border: "1px solid #e0e0e0",
      padding: "16px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <canvas id="stencil-canvas" ref={canvasRef} />
      <div style={{
        marginTop: "12px",
        fontSize: "13px",
        color: "#666",
        textAlign: "center"
      }}>
        <strong>Controls:</strong> Drag to move • Use corner handles to zoom • Click Reset to restore
      </div>
    </div>
  );
}