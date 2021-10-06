import { initializeApp, getApp } from "@firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { GeistProvider, CssBaseline } from "@geist-ui/react";
import { AuthenticatedRoute } from "./app/routing";
import Authorize from "./Authorize";
import Home from "./Home";

initializeApp({
  apiKey: "AIzaSyAXsuR4q-MGmmSmgeSqPD7P-_MLc1rVE60",
  authDomain: "spotify-moods-0.firebaseapp.com",
  databaseURL:
    "https://spotify-moods-0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "spotify-moods-0",
  storageBucket: "spotify-moods-0.appspot.com",
  messagingSenderId: "738097572316",
  appId: "1:738097572316:web:428b627f83ace1e12f4719",
  measurementId: "G-FZRBTDXZNC",
});

const auth = getAuth();

if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFunctionsEmulator(getFunctions(getApp()), "localhost", 5001);
}

function App() {
  return (
    <GeistProvider>
      <CssBaseline />
    <Router>
      <Switch>
        <AuthenticatedRoute path="/authenticated">
          <div>You should be authenticated</div>
        </AuthenticatedRoute>
        <Route path="/authorize">
          <Authorize />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
    </GeistProvider>
  );
}

export default App;
