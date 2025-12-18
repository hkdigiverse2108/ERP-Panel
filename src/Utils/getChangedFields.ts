export const getChangedFields = (newVal: any, oldVal: any) => {
  const changed: any = {};

  Object.keys(newVal).forEach((key) => {
    const newValue = newVal[key];
    const oldValue = oldVal?.[key];

    // ignore undefined
    if (newValue === undefined) return;

    const isObject = typeof newValue === "object" && newValue !== null;

    if (isObject) {
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        changed[key] = newValue; // includes cleared nested objects
      }
    } else {
      if (newValue !== oldValue) {
        // includes "" when user clears field
        changed[key] = newValue;
      }
    }
  });

  return changed;
};
