import type { Params } from "../Types";

export const cleanParams = (params?: Params): Params | undefined => {
  if (!params) return undefined;

  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""));
};
