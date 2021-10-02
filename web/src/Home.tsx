import { deleteUser, getAuth, signOut } from "firebase/auth";
import { useCallback } from "react";
import { useAuthState } from "./app/auth";
import { useUser } from "./app/user";

function Home() {
  const authState = useAuthState();
  const user = useUser();
  const signOutHandler = useCallback(() => signOut(getAuth()), []);
  const deleteAccountHandler = useCallback(async () => {
    if (user) {
      await deleteUser(user);
      console.log("deleted");
    }
  }, [user]);

  return (
    <div>
      <h1>Home</h1>
      {authState && (
        <div>
          <p>Signed in</p>
          <button onClick={signOutHandler}>Sign out</button>
          <button onClick={deleteAccountHandler}>Delete me</button>
        </div>
      )}
      {authState === false && <a href="/authorize">Login with Spotify</a>}
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

export default Home;
