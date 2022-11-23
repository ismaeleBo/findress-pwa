import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export default store;
