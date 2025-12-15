  export const getChangedFields = (newVal: any, oldVal: any) => {
    const changed: any = {};

    Object.keys(newVal).forEach((key) => {
      if (newVal[key] !== undefined && newVal[key] !== oldVal?.[key]) {
        changed[key] = newVal[key];
      }
    });

    return changed;
  };