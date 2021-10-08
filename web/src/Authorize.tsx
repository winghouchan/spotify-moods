import { Card, Code, Grid, Text } from "@geist-ui/react";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { useCallback, useEffect } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { useAuthState } from "./app/auth";
import SpotifyLogo from "./SpotifyLogo";

function Authorize() {
  const authState = useAuthState();
  const history = useHistory();
  const urlParams = new URLSearchParams(useLocation().search);
  const code = urlParams.get("code");
  const error = urlParams.get("error");
  const clientState = urlParams.get("state");

  const token = useCallback(async (data) => {
    const { projectId } = getFunctions().app.options;

    return await (
      await fetch(`https://${projectId}.web.app/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      })
    ).json();
  }, []);

  useEffect(() => {
    if (error) {
      return;
    }

    if (authState === false && code && clientState) {
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
      if (process.env.NODE_ENV === "development") {
        window.location.href =
          "http://localhost:5001/spotify-moods-0/us-central1/authorize";
      } else {
        const { projectId } = getFunctions().app.options;
        window.location.href = `https://${projectId}.web.app/authorize`;
      }
    }
  }, [authState, code, error, clientState]);

  return (
    <Grid.Container height={"100%"}>
      {authState && <Redirect to="/" />}
      <Grid xs={0} sm={4} md={6}></Grid>
      <Grid xs={24} sm md justify={"center"} alignItems={"center"}>
        <Card width={"90%"}>
          <Grid.Container gap={2} direction={"column"} alignItems={"center"}>
            <Grid pt={2}>
              <SpotifyLogo
                style={{
                  height: 50,
                  width: 50,
                }}
              />
            </Grid>
            <Grid px={1}>
              {!error && (
                <Text h1 font={2}>
                  Authorizing <br /> with Spotify
                </Text>
              )}
              {error && (
                <>
                  <Text h1 font={2} style={{ textAlign: "center" }}>
                    {error === "access_denied"
                      ? "You did not grant access to your Spotify data"
                      : "Something went wrong \xa0☹️"}
                  </Text>
                </>
              )}
            </Grid>
          </Grid.Container>
          {error && (
            <Card.Footer>
              <Text>Error code:</Text>
              <Code>{error}</Code>
            </Card.Footer>
          )}
        </Card>
      </Grid>
      <Grid xs={0} sm={4} md={6}></Grid>
    </Grid.Container>
  );
}

export default Authorize;
