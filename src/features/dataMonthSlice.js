import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addMonth, removeMonth, uploadMonth, getAllMonth, uploadImage, getAllImage } from '../api/DataMonth.js';

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

export const upload_image = createAsyncThunk(
  "upload_image/upload_image",
  async (data) => {
    console.log(data,'e32ewfrdvf')
    await uploadImage(data);
    const { data: dataImage } = await getAllImage();
    return dataImage;

  }
);

export const getImage = createAsyncThunk(
  "upload_image/getImage",
  async (data) => {
    const { data: dataImage } = await getAllImage();
    return dataImage;

  }
);

const dataMonthSlice = createSlice({
  name: "monthgories",
  initialState: {
    value: [],
    valueImage: [],
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
    builder.addCase(upload_image.fulfilled, (state, action) => {
      state.loading = true;
      state.valueImage = action.payload;
    });
    builder.addCase(getImage.fulfilled, (state, action) => {
      state.loading = true;
      state.valueImage = action.payload;
    });
  },
});
export default dataMonthSlice.reducer;
