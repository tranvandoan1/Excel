import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDataFashion, removeMonth, uploadDataDataFashion, getAllDataFashion, uploadImage, getAllImage } from '../api/DataFashion.js';

async function getAll() {
  const { data: dataFashion } = await getAllDataFashion();
  console.log(dataFashion,'dataFashion2123')
  return dataFashion;
}
export const getAllDataFashionF = createAsyncThunk(
  "dataFashion/getAllDataFashionF",
  async () => {
    return getAll();
  }
);

export const uploadDataDataFashionF = createAsyncThunk(
  "dataFashion/uploadDataDataFashionF",
  async (data) => {
    await uploadDataDataFashion(data);
    return getAll();

  }
);
export const addDataDataFashionF = createAsyncThunk(
  "dataFashion/addDataDataFashionF",
  async (data) => {
    console.log(data, '221ewdewd')
    await addDataFashion(data);
    return getAll();

  }
);
export const removemonthgori = createAsyncThunk(
  "dataFashion/removemonthgori",
  async (id) => {
    await removeMonth(id);
    return getAll();

  }
);

export const upload_image = createAsyncThunk(
  "dataFashion/upload_image",
  async (data) => {
    console.log(data,'e32ewfrdvf')
    await uploadImage(data);
    const { data: dataImage } = await getAllImage();
    return dataImage;

  }
);

export const getImage = createAsyncThunk(
  "dataFashion/getImage",
  async (data) => {
    const { data: dataImage } = await getAllImage();
    return dataImage;

  }
);

const dataFashionSlice = createSlice({
  name: "dataFashion",
  initialState: {
    value: [],
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(getAllDataFashionF.fulfilled, (state, action) => {
      state.loading = true;
      state.value = action.payload;
    });

    builder.addCase(uploadDataDataFashionF.fulfilled, (state, action) => {
      state.loading = true;
      state.value = action.payload;
    });

    builder.addCase(removemonthgori.fulfilled, (state, action) => {
      state.loading = true;
      state.value = action.payload;
    });
    builder.addCase(addDataDataFashionF.fulfilled, (state, action) => {
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
export default dataFashionSlice.reducer;
