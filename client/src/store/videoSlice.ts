import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
  name: "video",
  initialState: {
    users: new Array(),
    start: false,
    microphone: false,
    camera: false,
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action) => {
      state.users = [...state.users, action.payload];
    },
    setStart: (state, action) => {
      state.start = action.payload;
    },
    setCamera: (state, action) => {
      state.camera = action.payload;
    },
    setMicrophone: (state, action) => {
      state.microphone = action.payload;
    },
    toggleCamera: state => {
      state.camera = !state.camera;
    },
    toggleMicrophone: state => {
      state.microphone = !state.microphone;
    },
    reset: state => {
      state = videoSlice.getInitialState();
    },
  },
});

export default videoSlice;
