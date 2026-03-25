export const RemoveEmptyFields = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const result: Partial<T> = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;

    if (typeof value === "object" && !Array.isArray(value)) {
      const cleaned = RemoveEmptyFields(value);
      if (Object.keys(cleaned).length > 0) {
        result[key as keyof T] = cleaned as T[keyof T];
      }
      return;
    }

    result[key as keyof T] = value;
  });

  return result;
};

// export const RemoveEmptyFields = <T extends Record<string, any>>(obj: T): Partial<T> => {
//   const result: Partial<T> = {};

//   Object.entries(obj).forEach(([key, value]) => {
//     if (value === null || value === undefined || value === "") return;

//     // ⚠️ phone object — API level only
//     if (typeof value === "object" && value !== null && !Array.isArray(value) && "countryCode" in value && "phoneNo" in value) {
//       if (!value.phoneNo) return; // ⛔ do NOT keep partial phone
//       result[key as keyof T] = value;
//       return;
//     }

//     if (typeof value === "object" && !Array.isArray(value)) {
//       const cleaned = RemoveEmptyFields(value);
//       if (Object.keys(cleaned).length > 0) {
//         result[key as keyof T] = cleaned as T[keyof T];
//       }
//       return;
//     }

//     result[key as keyof T] = value;
//   });

//   return result;
// };

export const GetChangedFields = (newVal: Record<string, any>, oldVal: Record<string, any> = {}): Record<string, any> => {
  const changed: Record<string, any> = {};

  const isEmpty = (v: any) => v === "" || v === null || v === undefined;

  Object.keys(newVal).forEach((key) => {
    const newValue = newVal[key];
    const oldValue = oldVal[key];

    // ✅ Object (not array)
    if (typeof newValue === "object" && newValue !== null && !Array.isArray(newValue)) {
      const nestedChanged = GetChangedFields(newValue, oldValue ?? {});

      // 🔥 Any change → send full object
      if (Object.keys(nestedChanged).length > 0) {
        changed[key] = newValue;
      }

      return;
    }

    // ❌ both empty
    if (isEmpty(newValue) && isEmpty(oldValue)) return;

    // ✅ primitive / array changed
    if (newValue !== oldValue) {
      changed[key] = newValue;
    }
  });

  return changed;
};

// export const GetChangedFields = <T extends Record<string, any>>(newVal: T, oldVal?: Partial<T>): Partial<T> => {
//   const changed: Partial<T> = {};

//   (Object.keys(newVal) as (keyof T)[]).forEach((key) => {
//     const newValue = newVal[key];
//     const oldValue = oldVal[key];

//     // ❌ Object / Array skip
//     //  if (typeof newValue === "object" && newValue !== null) return;

//     // ❌ Object skip (arrays are handled)
//     // if (typeof newValue === "object" && newValue !== null && !Array.isArray(newValue)) return;

//     if (typeof newValue === "object" && newValue !== null && !Array.isArray(newValue)) {
//       const nestedChanged = GetChangedFields(newValue, (oldValue as Record<string, any>) ?? {});

//       // 🔥 If ANY nested value changed → send FULL object
//       if (Object.keys(nestedChanged).length > 0) {
//         changed[key] = newValue;
//       }

//       return;
//     }

//     const isEmpty = (v: any) => v === "" || v === null || v === undefined;

//     // ❌ both old & new empty → ignore
//     if (isEmpty(newValue) && isEmpty(oldValue)) return;

//     // ✅ changed OR cleared value
//     if (newValue !== oldValue) {
//       changed[key] = newValue;
//     }
//   });

//   return changed;
// };

export const SanitizePayload = (input: any): any => {
  // 🛑 handle null / undefined
  if (input === null || input === undefined) {
    return input;
  }

  // 🟡 handle array
  if (Array.isArray(input)) {
    return input.map((item) => SanitizePayload(item));
  }

  // 🟢 handle object
  if (typeof input === "object") {
    return Object.entries(input || {}).reduce((acc: any, [key, value]) => {
      let newValue = value;

      // 🔥 "" → null
      if (newValue === "") {
        newValue = null;
      }

      // 🔁 recursion
      newValue = SanitizePayload(newValue);

      acc[key] = newValue;
      return acc;
    }, {});
  }

  // 🔹 primitive (string, number, boolean)
  return input;
};
