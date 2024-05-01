import { CategoryWithSuccessors } from "@/lib/types";
import { Brand, Category, Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ReadonlyURLSearchParams } from "next/navigation";

// These hooks are used to fetch data from the server
// and must be used inside a client component only.

export const useProduct = (
  slug: string,
  searchParams?: ReadonlyURLSearchParams | URLSearchParams
) => {
  const query = searchParams && searchParams.toString();
  return useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: () =>
      fetch(`/api/products/${slug}${query ? "?" + query : ""}`).then(res => res.json()),
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
  });
};

export const useProducts = (searchParams?: ReadonlyURLSearchParams | URLSearchParams) => {
  const query = searchParams && searchParams.toString();
  return useQuery<{ products: Product[]; count: number }>({
    queryKey: ["products"],
    queryFn: () => fetch(`/api/products${query ? "?" + query : ""}`).then(res => res.json()),
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
  });
};

export const useSearchProducts = (searchParams?: ReadonlyURLSearchParams | URLSearchParams) => {
  const query = new URLSearchParams(searchParams && searchParams.toString());
  query.set("take", "6");
  query.set("popular", "true");
  return useQuery<Product[]>({
    queryKey: ["searchProducts"],
    queryFn: () => fetch(`/api/products${query ? "?" + query : ""}`).then(res => res.json()),
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
  });
};

export const useBrands = (searchParams?: ReadonlyURLSearchParams | URLSearchParams) => {
  const query = searchParams && searchParams.toString();
  return useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: () => fetch(`/api/brands${query ? "?" + query : ""}`).then(res => res.json()),
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
  });
};

export const useCategories = (searchParams?: ReadonlyURLSearchParams | URLSearchParams) => {
  const query = searchParams && searchParams.toString();
  return useQuery<Category[] | CategoryWithSuccessors[]>({
    queryKey: ["categories"],
    queryFn: () => fetch(`/api/categories${query ? "?" + query : ""}`).then(res => res.json()),
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
  });
};
