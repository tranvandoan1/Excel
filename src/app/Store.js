import { configureStore } from "@reduxjs/toolkit";
import dataMonthSlice from "../features/dataMonthSlice";
import dataFashionSlice from "../features/dataFashion";

export const store = configureStore({
  reducer: {
    dataMonth: dataMonthSlice,
    dataFashion: dataFashionSlice,
  },
});
