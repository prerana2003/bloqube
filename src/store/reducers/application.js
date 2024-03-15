// types
import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  openItem: ["sponsor"],
  defaultId: "dashboard",
  openComponent: "buttons",
  drawerOpen: false,
  componentDrawerOpen: true,
};

// ==============================|| SLICE - MENU ||============================== //

const application = createSlice({
  name: "application",
  initialState,
  reducers: {
    activeItem(state, action) {
      state.openItem = action.payload.openItem;
    },

    activeComponent(state, action) {
      state.openComponent = action.payload.openComponent;
    },

    openDrawer(state, action) {
      state.drawerOpen = action.payload.drawerOpen;
    },

    openComponentDrawer(state, action) {
      state.componentDrawerOpen = action.payload.componentDrawerOpen;
    },
  },
});

export default application.reducer;

export const { activeItem, activeComponent, openDrawer, openComponentDrawer } =
  application.actions;
