import { Button, Grid, Text } from "@geist-ui/react";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import SpotifyLogo from "../SpotifyLogo";

export default function SignIn() {
  const history = useHistory();

  const navigateToAuthorize = useCallback(() => {
    history.push("/signin");
  }, []);

  return (
    <Grid.Container height={"100%"}>
      <Grid xs={24} sm={14} md={12} alignItems={"center"} px={4}>
        <Text h1>See how your mood affects your music</Text>
      </Grid>
      <Grid xs={24} sm={10} md={12} justify={"center"} alignItems={"center"}>
        <Grid.Container gap={3} alignItems={"center"} direction={"column"}>
          <Grid>
            <SpotifyLogo style={{ height: 125, width: 125 }} />
          </Grid>
          <Grid>
            <Button type="secondary" onClick={navigateToAuthorize}>
              Login with Spotify
            </Button>
          </Grid>
        </Grid.Container>
      </Grid>
    </Grid.Container>
  );
}
