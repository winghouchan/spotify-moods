import { useAuthState } from "../app/auth";
import Dashboard from "./Dashboard";
import SignIn from "./SignIn";

function Home() {
  const authState = useAuthState();

  return (
    <>
      {authState && <Dashboard />}
      {authState === false && <SignIn />}
    </>
  );
}

export default Home;
