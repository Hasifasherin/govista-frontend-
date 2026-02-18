import api from "../utils/api";
import {
  WishlistResponse,
  WishlistActionResponse,
} from "../types/wishlist";

/* ================= Get Wishlist ================= */
export const getWishlist = async (): Promise<WishlistResponse> => {
  const response = await api.get("/users/wishlist");
  return response.data;
};

/* ================= Add to Wishlist ================= */
export const addToWishlist = async (
  tourId: string
): Promise<WishlistActionResponse> => {
  const response = await api.post("/users/wishlist", { tourId });
  return response.data;
};

/* ================= Remove from Wishlist ================= */
export const removeFromWishlist = async (
  tourId: string
): Promise<WishlistActionResponse> => {
  const response = await api.delete(`/users/wishlist/${tourId}`);
  return response.data;
};
