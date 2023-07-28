import { RouterProvider } from "react-router-dom";
import routes from "./@routes";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/fireBase";
import { Loader } from "rsuite";

function App() {
  const [user, setUser] = useState("adams");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  if (user === "adams") {
    return (
      <div style={{ height: "100vh", background: "#ffffff" }}>
        <Loader center content="loading..." size="lg" />
      </div>
    );
  }

  return <RouterProvider router={routes} />;
}

export default App;
