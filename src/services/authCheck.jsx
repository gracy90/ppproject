import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./fireBase";
import { useState } from "react";

export const IsLogin = () => {
  const [isIn, setIsIn] = useState();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      setIsIn(user.uid);
      // ...
    } else {
      setIsIn(null);
    }
  });

  return { isIn };
};
