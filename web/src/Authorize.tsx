import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useEffect } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { useAuthState } from "./app/auth";

function Authorize() {
  const authState = useAuthState();
  const history = useHistory();
  const urlParams = new URLSearchParams(useLocation().search);
  const code = urlParams.get("code");
  const error = urlParams.get("error");
  const clientState = urlParams.get("state");

  const loading =
    typeof authState === "undefined" || (!code && !error && !clientState);

  useEffect(() => {
    if (error) {
      return;
    }

    if (authState === false && code && clientState) {
      const token = httpsCallable<
        { code: string; state: string },
        { token: string }
      >(getFunctions(), "token");

      token({
        code,
        state: clientState,
      })
        .then(({ data: { token } }) => signInWithCustomToken(getAuth(), token))
        .then(() => {
          history.push("/");
        })
        .catch(({ code, message, details }) =>
          console.log({ code, message, details })
        );

      return;
    }

    if (authState === false && !code) {
      window.location.href =
        "http://localhost:5001/spotify-moods-0/us-central1/authorize";
    }
  }, [authState, code, error, clientState]);

  return (
    <div>
      {authState && <Redirect to="/" />}
      <h1>Authorize</h1>
      {loading && <p>Loading</p>}
      {error && <p>There was an error: {error}</p>}
      {code && <p>Here's the code: {code}</p>}
      {clientState && <p>Here the state: {clientState}</p>}
    </div>
  );
}

export default Authorize;
