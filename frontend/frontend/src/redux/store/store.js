import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/users/usersSlices";
import categoriesReducer from "../slices/categories/categoriesSlices";

const store = configureStore({
  reducer: {
    users: usersReducer,
    categories: categoriesReducer,
  },
});

export default store;
