import { STORAGE_KEYS } from "../Constants";


export const getStorage = () => localStorage;

export const getToken = () => {
  const storage = getStorage();
  const token = storage.getItem(STORAGE_KEYS.TOKEN);
  return token;
};
