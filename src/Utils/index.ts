export * from "./FormHelpers";
import { STORAGE_KEYS } from "../Constants";
import type { Params } from "../Types";


export const Stringify = (value: object): string => {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
};

export const Storage = localStorage;

export const getToken = () => {
  const token = Storage.getItem(STORAGE_KEYS.TOKEN);
  return token;
};

export const CleanParams = (params?: Params): Params | undefined => {
  if (!params) return undefined;

  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""));
};