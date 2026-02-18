import API from "../utils/api";
import { Slider } from "../types/slider";

/** Helper to get admin token from localStorage */
const getAuthHeaders = () => {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
/** ADMIN – fetch sliders */
export const getSliders = async (): Promise<Slider[]> => {
  const res = await API.get("/sliders", {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return res.data.data || [];
};

/** ADMIN – create a new slider with progress callback */
export const createSlider = async (
  formData: FormData,
  onProgress?: (percent: number) => void
): Promise<Slider> => {
  const res = await API.post("/sliders", formData, {
    headers: {
      ...getAuthHeaders(), // Authorization header included
      // do NOT manually set Content-Type, Axios handles it for FormData
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });

  return res.data.data;
};

/** ADMIN – delete slider */
export const deleteSlider = async (id: string) => {
  const res = await API.delete(`/sliders/${id}`);
  return res.data;
};
