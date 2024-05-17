import { DateValue } from "@internationalized/date";
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
  value: DateValue | Date | string | number | null | undefined,
  schema: ZodSchema
): string | true => {
  const valid = schema.safeParse(value);
  return valid.success ? true : formatErrors(valid.error).message;
};

export function getFormDataObject<TData>(formData: FormData) {
  const data: { [key: string]: FormDataEntryValue } = {};
  formData.forEach((value, key) => (data[key] = value));
  return data as TData;
}

export function formatErrors(error: ZodError | Error) {
  if (error instanceof ZodError) {
    const formErrors = error.flatten().formErrors;
    const fieldErrors = error.flatten().fieldErrors;
    return {
      message:
        formErrors.length > 0
          ? formErrors.join("\n")
          : Object.values(fieldErrors)
              .map(e => e?.join("\n"))
              .join(". "),
    };
  }
  return { message: error.message };
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
