import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPost = createAsyncThunk(
  "post/list",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      return data;
    } catch (error) {
      return error?.response;
    }
  }
);

const postSlices = createSlice({
  name: "post",
  initialState: {},
  extraReducers: {
    [fetchPost.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchPost.fulfilled]: (state, action) => {
      state.postList = action.payload;
      state.loading = false;
    },
    [fetchPost.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default postSlices.reducer;
