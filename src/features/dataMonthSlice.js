import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addMonth, removeMonth, uploadMonth,getAllMonth } from '../api/DataMonth.js';

async function getAll() {
  const { data: dataMonth } = await getAllMonth();
  return dataMonth;
}
export const getAllDataMonth = createAsyncThunk(
  "dataMonth/getAllDataMonth",
  async () => {
    return getAll();
  }
);

export const uploadmonthgori = createAsyncThunk(
  "dataMonth/uploadmonthgori",
  async (data) => {
    await uploadMonth(data);
    return getAll();

  }
);
export const addDataMonth = createAsyncThunk(
  "dataMonth/addDataMonth",
  async (data) => {
    console.log(data, '221ewdewd')
    await addMonth(data);
    return getAll();

  }
);
export const removemonthgori = createAsyncThunk(
  "dataMonth/removemonthgori",
  async (id) => {
    await removeMonth(id);
    return getAll();

  }
);


const dataMonthSlice = createSlice({
  name: "monthgories",
  initialState: {
    value: [],
    loading: false
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(getAllDataMonth.fulfilled, (state, action) => {
      state.loading = true;
      state.value = action.payload;
    });

    builder.addCase(uploadmonthgori.fulfilled, (state, action) => {
      state.loading = true;
      state.value = action.payload;
    });

    builder.addCase(removemonthgori.fulfilled, (state, action) => {
      state.loading = true;
      state.value = action.payload;
    });
    builder.addCase(addDataMonth.fulfilled, (state, action) => {
      state.loading = true;
      state.value = action.payload;
    });
  },
});
export default dataMonthSlice.reducer;
