# Stencil Tool

A canvas-based stencil editor built with **React**, **Fabric.js**, and **Redux**.

---

## 💾 Deliverables

1. **GitHub Repo**: [https://github.com/kgaur032/stencil-tool](https://github.com/kgaur032/stencil-tool)  
2. **Working Demo**: Run locally by following instructions below.  
3. **Brief Documentation**: Key parts explained in this README.

---

## 🛠 Brief Documentation

### 1. Project Overview
Stencil Tool is a canvas-based editor built with **React**, **Fabric.js**, and **Redux**.  
It allows users to upload images, draw shapes, manage layers, and export their designs.

---

### 2. Key Technologies Used
- **React** — UI rendering and component structure.
- **Fabric.js** — Canvas drawing and object manipulation.
- **Redux** — Centralized state management.
- **Vite** — Development build tool for fast bundling.
- **Docker** — Containerized development environment (optional).

---

### 3. Core Implementation Details

#### a) Canvas Management
- Fabric.js is used to create a dynamic canvas where shapes and images can be drawn and modified.
- The canvas is initialized in a dedicated React component (`CanvasEditor.jsx`).

#### b) State Management with Redux
- All stencil objects (shapes, images, layers) are stored in Redux store.
- This enables easy undo/redo functionality and consistent state across components.

#### c) Image Upload
- Users can upload images through an upload button.
- Uploaded images are added to the Fabric.js canvas and can be resized or rotated.

#### d) Export Feature
- The canvas can be exported as an image file using Fabric.js's `.toDataURL()` function.

#### e) Docker Support
- Dockerfile provided to run the project in a container for consistent environments.

---


## 🚀 Run Locally

### Prerequisites
- Node.js (v23.10.0 recommended)
- npm

### Steps
```bash
git clone https://github.com/username/stencil-tool.git
cd stencil-tool
npm install
npm run dev
