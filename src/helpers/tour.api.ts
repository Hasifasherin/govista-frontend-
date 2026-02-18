import api from "../utils/api";

export type FeaturedTour = {
  _id: string;
  title: string;
  image: string;
  location: string;
};

export const getFeaturedTours = async (): Promise<{ tours: FeaturedTour[] }> => {
  const res = await api.get("/tours/featured"); // axios instance + URL
  return res.data;
};
