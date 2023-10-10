import { configureStore } from "@reduxjs/toolkit";
import dataMonthSlice from "../features/dataMonthSlice";

export const store = configureStore({
  reducer: {
    dataMonth: dataMonthSlice,
  },
});
