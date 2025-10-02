import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  src: null,
  transform: null,
  initialTransform: null, // NEW: Store initial transform for reset
  history: [],
  selectedFrame: {
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
};

const slice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setImageSrc(state, action) {
      state.src = action.payload;
      state.transform = null;
      state.initialTransform = null;
      state.history = [];
    },
    setTransform(state, action) {
      const t = action.payload;
      
      // Store first transform as initial
      if (!state.initialTransform && t) {
        state.initialTransform = { ...t };
      }
      
      if (state.transform) {
        state.history.push({ ...state.transform });
      }
      state.transform = t;
    },
    resetTransform(state) {
      // Reset to initial transform instead of null
      if (state.initialTransform) {
        state.transform = { ...state.initialTransform };
      } else {
        state.transform = null;
      }
      state.history = [];
    },
    undo(state) {
      if (state.history.length) {
        state.transform = state.history.pop();
      }
    },
    setSelectedFrame(state, action) {
      state.selectedFrame = action.payload;
    },
  },
});

export const { 
  setImageSrc, 
  setTransform, 
  resetTransform, 
  undo,
  setSelectedFrame 
} = slice.actions;

export default slice.reducer;