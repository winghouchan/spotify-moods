import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuthState } from "../auth";

interface AuthenticatedRouteProps extends RouteProps {}

export default function AuthenticatedRoute({
  children,
  ...props
}: AuthenticatedRouteProps) {
  const authState = useAuthState();

  if (authState) {
    return <Route {...props}>{children}</Route>;
  }

  if (authState === false) {
    return <Redirect to="/" />;
  }

  return <div>Loading auth state</div>;
}
