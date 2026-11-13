export function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function optionalFormString(formData: FormData, key: string): string | null {
  return formString(formData, key) || null;
}
