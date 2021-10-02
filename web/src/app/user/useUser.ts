import { getAuth, onAuthStateChanged, User } from "@firebase/auth";
import { useEffect, useState } from "react";

export default function useUser() {
  const [user, setUser] = useState<User>();

  useEffect(
    () =>
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(undefined);
        }
      }),
    []
  );

  return user;
}
