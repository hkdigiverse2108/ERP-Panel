export const removeEmptyFields = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const result: Partial<T> = {};

  (Object.entries(obj) as [keyof T, any][]).forEach(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const cleaned = removeEmptyFields(value);
      if (Object.keys(cleaned).length > 0) {
        result[key] = cleaned as T[keyof T];
      }
      return;
    }

    if (value === "" || value === null || value === undefined) {
      return;
    }

    result[key] = value;
  });

  return result;
};

export const cleanEditPayload = <T extends Record<string, any>>(changed: Partial<T>, original?: Partial<T>): Partial<T> => {
  const result: Partial<T> = {};

  (Object.entries(changed) as [keyof T, any][]).forEach(([key, value]) => {
    if (value === "" && original?.[key]) {
      result[key] = value;
      return;
    }

    if (value === "" || value === null || value === undefined) {
      return;
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      const cleaned = cleanEditPayload(value, original?.[key] as Record<string, any>);

      if (Object.keys(cleaned).length > 0) {
        result[key] = cleaned as T[keyof T];
      }
      return;
    }

    result[key] = value;
  });

  return result;
};
