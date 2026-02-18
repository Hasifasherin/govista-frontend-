"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAdminAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.replace("/admin/login"); // redirect to admin login if not logged in
    }
  }, [router]);
};
