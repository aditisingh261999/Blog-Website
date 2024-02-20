import { configureStore } from "@reduxjs/toolkit";
import userreducer from "../user/userSlice";

export const store = configureStore({
  reducer: {
    user: userreducer,
  },
});
