// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./slices/authSlice";
// import productReducer from "./slices/productSlice";

// const store = configureStore({
//     reducer: {
//         auth: authReducer,
//         product: productReducer,
//     },
// });

// export default store;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
