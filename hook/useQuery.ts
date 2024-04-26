import { Brand, Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export const useBrands = () => {
  return useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: () => fetch(`/api/brands`).then(res => res.json()),
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
  });
};

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetch(`/api/categories`).then(res => res.json()),
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
  });
};
