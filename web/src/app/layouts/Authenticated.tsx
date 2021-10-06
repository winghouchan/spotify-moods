import { Avatar, Grid, Link, Page, Popover, Text, User } from "@geist-ui/react";
import { deleteUser, getAuth, signOut } from "firebase/auth";
import { MouseEvent, PropsWithChildren, useCallback, useContext } from "react";
import ThemeContext from "../theme/ThemeContext";
import { useUser } from "../user";

interface AuthenticatedLayoutProps extends PropsWithChildren<{}> {}

function PopoverMenu() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const user = useUser();
  const signOutHandler = useCallback((event: MouseEvent) => {
    event.preventDefault();
    signOut(getAuth());
  }, []);
  const deleteAccountHandler = useCallback(
    async (event: MouseEvent) => {
      event.preventDefault();

      if (user) {
        await deleteUser(user);
      }
    },
    [user]
  );

  return (
    <>
      <Popover.Item>
        <Link
          onClick={(event) => {
            event.preventDefault();
            toggleTheme();
          }}
        >
          {theme === "light" ? "Dark" : "Light"} mode
        </Link>
      </Popover.Item>
      <Popover.Item>
        <Link onClick={signOutHandler}>Sign out</Link>
      </Popover.Item>
      <Popover.Item>
        <Link onClick={deleteAccountHandler} style={{ color: "red" }}>
          Delete account
        </Link>
      </Popover.Item>
    </>
  );
}

export default function Authenticated({ children }: AuthenticatedLayoutProps) {
  const currentHour = new Date().getHours();
  const user = useUser();

  return (
    <Grid.Container>
      <Grid xs={0} sm={1} md={3} lg={4}></Grid>
      <Grid xs={24} sm direction={"column"}>
        <Page.Header py={1}>
          <Grid.Container>
            <Grid xs={15} sm={18} pl={1} alignItems={"center"}>
              <Text h1 font={2}>
                {currentHour >= 3 && currentHour < 12
                  ? "Good morning"
                  : currentHour >= 12 && currentHour < 17
                  ? "Good afternoon"
                  : currentHour >= 17 && currentHour < 21
                  ? "Good evening"
                  : currentHour >= 21 || currentHour < 3
                  ? "Good night"
                  : "Hello"}
              </Text>
            </Grid>
            <Grid xs sm md lg justify={"flex-end"} alignItems={"center"}>
              <Popover
                style={{ cursor: "pointer" }}
                content={<PopoverMenu />}
                disableItemsAutoClose={true}
              >
                <Grid.Container alignItems={"center"} gap={1}>
                  <Grid>
                    <Text b>Wing</Text>
                  </Grid>
                  <Grid>
                    <Avatar
                      src={user?.photoURL || ""}
                      text={user?.displayName?.charAt(0)}
                      scale={2}
                    />
                  </Grid>
                </Grid.Container>
              </Popover>
            </Grid>
          </Grid.Container>
        </Page.Header>
        <Page.Content px={1}>{children}</Page.Content>
      </Grid>
      <Grid xs={0} sm={1} md={3} lg={4}></Grid>
    </Grid.Container>
  );
}
