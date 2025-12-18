export const removeEmptyFields = (obj: any): any => {
  return Object.fromEntries(
    Object.entries(obj).flatMap(([key, value]) => {
      // nested object
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const cleaned = removeEmptyFields(value);
        return Object.keys(cleaned).length > 0 ? [[key, cleaned]] : [];
      }

      // remove empty
      if (value === "" || value === null || value === undefined) {
        return [];
      }

      return [[key, value]];
    })
  );
};
export const cleanEditPayload = (changed: Record<string, any>, original: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(changed).flatMap(([key, value]) => {
      if (value === "" && original?.[key]) {
        return [[key, value]];
      }

      if (value === "" || value === null || value === undefined) {
        return [];
      }

      if (value && typeof value === "object" && !Array.isArray(value)) {
        const cleaned = cleanEditPayload(value as Record<string, any>, original?.[key] as Record<string, any>);

        return Object.keys(cleaned).length > 0 ? [[key, cleaned]] : [];
      }

      return [[key, value]];
    })
  );
};
