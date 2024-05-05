import { type ClassValue, clsx } from "clsx";
import { capitalize as _capitalize, update } from "lodash";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { ZodError, ZodSchema } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * capitalize the first letter of each word in a string
 * @param value string
 * @returns { string } string
 */
export function capitalize(value: string): string {
  return value
    .split(" ")
    .map(i => _capitalize(i))
    .join(" ");
}

export const validateSchema = (
  value: string | number | null | undefined,
  schema: ZodSchema
): string | true => {
  const valid = schema.safeParse(value);
  return valid.success ? true : formatErrors(valid.error).message;
};

export function getFormDataObject(formData: FormData): { [key: string]: FormDataEntryValue } {
  const data: { [key: string]: FormDataEntryValue } = {};
  formData.forEach((value, key) => (data[key] = value));
  return data;
}

export function formatErrors(error: ZodError) {
  const formErrors = error.flatten().formErrors;
  const fieldErrors = error.flatten().fieldErrors;
  return {
    message:
      formErrors.length > 0
        ? formErrors.join(", ")
        : Object.values(fieldErrors)
            .map(e => e?.join(", "))
            .join(". "),
  };
}

export function getQueryObject(searchParams: URLSearchParams | ReadonlyURLSearchParams) {
  const queryArr: { [key: string]: string | string[] } = {};
  searchParams.forEach((value, key) =>
    update(queryArr, key, v => {
      if (!v) return value;
      else if (typeof v === "string") return [v, value];
      else if (Array.isArray(v)) return [...v, value];
    })
  );
  return queryArr;
}
