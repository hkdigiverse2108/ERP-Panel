export const getChangedFields = <T extends Record<string, any>>(newVal: T, oldVal?: Partial<T>): Partial<T> => {
  const changed: Partial<T> = {};

  (Object.keys(newVal) as (keyof T)[]).forEach((key) => {
    const newValue = newVal[key];
    const oldValue = oldVal?.[key];

    // ignore undefined
    if (newValue === undefined) return;

    const isObject = typeof newValue === "object" && newValue !== null && !Array.isArray(newValue);

    if (isObject) {
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        changed[key] = newValue;
      }
    } else {
      if (newValue !== oldValue) {
        changed[key] = newValue;
      }
    }
  });

  return changed;
};
