import { useMutation } from "@tanstack/react-query";

// These hooks are used to edit or add data to the server
// and must be used inside a client component only.

export const useAddProduct = () =>
  useMutation({
    mutationKey: ["newProduct"],
    mutationFn: (data: { [key: string]: FormDataEntryValue | string[] }) =>
      fetch("/api/products", { method: "POST", body: JSON.stringify(data) }).then(res =>
        res.json()
      ),
  });

export const useSignupMutation = () =>
  useMutation({
    mutationKey: ["signup"],
    mutationFn: (data: { [key: string]: FormDataEntryValue }) =>
      fetch("/api/users", { method: "POST", body: JSON.stringify(data) }).then(res => res.json()),
  });
