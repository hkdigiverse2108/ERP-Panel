// export const removeEmptyFields = (obj: any): any => {
//   return Object.fromEntries(
//     Object.entries(obj).flatMap(([key, value]) => {
//       // handle nested object
//       if (value && typeof value === "object" && !Array.isArray(value)) {
//         const cleaned = removeEmptyFields(value);
//         return Object.keys(cleaned).length > 0 ? [[key, cleaned]] : [];
//       }

//       // remove empty values
//       if (value === "" || value === null || value === undefined) {
//         return [];
//       }

//       return [[key, value]];
//     })
//   );
// };

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
export const cleanEditPayload = (changed: any, original: any) => {
  return Object.fromEntries(
    Object.entries(changed).flatMap(([key, value]) => {
      // keep intentional clears
      if (value === "" && original?.[key]) {
        return [[key, value]]; // or null if backend expects null
      }

      // remove untouched empty
      if (value === "" || value === null || value === undefined) {
        return [];
      }

      // nested object cleanup
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const cleaned = cleanEditPayload(value, original?.[key]);
        return Object.keys(cleaned).length > 0 ? [[key, cleaned]] : [];
      }

      return [[key, value]];
    })
  );
};
