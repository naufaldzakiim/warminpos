import { useEffect, useState } from "react";
import { Storage } from "@ionic/storage";

const USER_KEY = "user";

export interface User {
  id: string;
  username: string;
  name: "Bos Warmindo";
  role: "owner";
}

export function useStorage() {
  const [store, setStore] = useState<Storage>();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initStorage = async () => {
      const newStore = new Storage();
      const store = await newStore.create();
      setStore(store);

      const storedUser = await store.get(USER_KEY);
      setUser(storedUser);
    };
    initStorage();
  }, []);

  useEffect(() => {
    console.log("user di storage", user);
  }, [user]);

  const setAuthUser = async (user: User) => {
    await store?.set(USER_KEY, user);
    setUser(user);
  };

  const clearAuthUser = async () => {
    await store?.remove(USER_KEY);
    setUser(null);
  };

  const isAuthUser = async () => {
    const storedUser = await store?.get(USER_KEY);
    console.log("storedUser", storedUser);
    return storedUser !== null;
  }

  const getAuthUser = async () => {
    const storedUser = await store?.get(USER_KEY);
    console.log("storedUser get", storedUser);
    return storedUser;
  }

  return { user, setAuthUser, clearAuthUser, isAuthUser, getAuthUser };
}
