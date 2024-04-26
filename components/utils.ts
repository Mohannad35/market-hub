import { update } from "lodash";
import { ReadonlyURLSearchParams } from "next/navigation";
import { ZodError } from "zod";

export function getFormDataObject(formData: FormData): { [key: string]: FormDataEntryValue } {
  const data: { [key: string]: FormDataEntryValue } = {};
  formData.forEach((value, key) => (data[key] = value));
  return data;
}

export function formatErrors(error: ZodError) {
  const formErrors = error.flatten().formErrors;
  const fieldErrors = error.flatten().fieldErrors;
  return {
    errors: formErrors.length > 0 ? formErrors : fieldErrors,
    messege:
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
