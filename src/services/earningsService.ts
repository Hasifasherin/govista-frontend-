// src/services/earningsService.ts

import { apiRequest } from "../utils/api";
import { EarningsStats } from "../types/earnings";

export const getOperatorEarnings = async (): Promise<EarningsStats> => {
  const data = await apiRequest<{ stats: EarningsStats }>(
    "GET",
    "/operator/dashboard"
  );

  return data.stats;
};
