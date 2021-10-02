import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

/**
 * Gets current authentication status
 *
 * @returns {boolean|undefined} `true` signifies the user is authenticated,
 *   `false` signifies the user is unauthenticated, and `undefined` signifies
 *   the authentication status is currently unavailable, likely still being
 *   fetched
 */
export default function useAuthState() {
  const [state, setState] = useState<boolean>();

  useEffect(
    () =>
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          setState(true);
        } else {
          setState(false);
        }
      }),
    []
  );

  return state;
}
