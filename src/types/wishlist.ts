import { Tour } from "./tour";

/* ================= API Response ================= */
export interface WishlistResponse {
  success: boolean;
  count: number;
  wishlist: Tour[];
}

/* ================= Add / Remove Response ================= */
export interface WishlistActionResponse {
  success: boolean;
  message: string;

  wishlist: string[];

}

/* ================= Redux State ================= */
export interface WishlistState {
  items: Tour[];
  loading: boolean;
  error: string | null;
}
