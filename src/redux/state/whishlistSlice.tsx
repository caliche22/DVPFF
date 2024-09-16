import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: {
    name: string;
    image: string;
  };
}

interface WishlistState {
  items: Product[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      const exists = state.items.some(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setWishlist: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addProduct, removeProduct, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
