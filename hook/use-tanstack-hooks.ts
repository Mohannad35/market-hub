import {
  keepPreviousData,
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";

// These hooks are used to fetch data from the server
// and must be used inside a client component only.

/**
 * This hook is used to fetch data from the server
 * @param url string API endpoint
 * @param key unique key for the query
 * @param query optional string query to append to the URL
 * @returns { UseQueryResult<TData, TError> }
 * object from react-query contains isLoading, isSuccess, isError, error, data, mutate, mutateAsync, reset, status...
 */
export function useQueryHook<TData, TError = Error>(
  url: string,
  key: string[],
  query?: string,
  enabled: boolean = true
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError>({
    queryKey: [...key],
    queryFn: async () => {
      const res = await fetch(`${url}${query ? "?" + query : ""}`);
      if (res.ok) return await res.json();
      else if (res.status >= 400 && res.status < 500)
        throw new Error((await res.json()).message || res.statusText);
      else throw new Error("A server error occurred");
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
    enabled,
    placeholderData: keepPreviousData,
  });
}

type TVariables = { [key: string]: string[] | FormDataEntryValue };
/**
 * This hook is used to add or edit data to the server
 * @param url string API endpoint
 * @param key unique key for the mutation
 * @param method string HTTP method to use (default is POST)
 * @param query optional string query to append to the URL
 * @returns { UseMutationResult<TData, TError, TVariables> }
 * object from react-query contains isLoading, isSuccess, isError, error, data, mutate, mutateAsync, reset, status...
 */
export function useMutationHook<TData, TError = Error>(
  url: string,
  key: string[],
  method = "POST",
  query?: string
): UseMutationResult<TData, TError, TVariables> {
  return useMutation<TData, TError, TVariables>({
    mutationKey: [...key],
    mutationFn: async data => {
      const res = await fetch(`${url}${query ? "?" + query : ""}`, {
        method: method,
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
      else if (res.status >= 400 && res.status < 500)
        throw new Error((await res.json()).message || res.statusText);
      else throw new Error("A server error occurred");
    },
  });
}
