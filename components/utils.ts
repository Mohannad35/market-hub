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
