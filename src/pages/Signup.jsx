/* eslint-disable react/no-children-prop */
/* eslint-disable react/display-name */
import React, { useState } from "react";
import {
  Form,
  ButtonToolbar,
  Button,
  Stack,
  Panel,
  Message,
  useToaster,
} from "rsuite";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import Animate from "../components/Animate";
import { auth } from "../services/fireBase";
import { useNavigate } from "react-router-dom";
// import bg from "../assets/s_l_bg.png";

const SignupComponent = React.forwardRef((props, ref) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const toaster = useToaster();
  const navigate = useNavigate();

  // 'success' | 'warning' | 'error' | 'info'
  const message = (message, type, header) => {
    return header ? (
      <Message showIcon type={type} closable header={header}>
        {message}
      </Message>
    ) : (
      <Message showIcon type={type} closable>
        {message}
      </Message>
    );
  };

  const sigUp = () => {
    toaster.push(message("Signing in...", "info"), {
      placement: "topEnd",
      duration: 5000,
    });

    if (auth.currentUser) {
      if (
        auth.currentUser.email === email &&
        auth.currentUser.password === password
      )
        updateProfile(auth.currentUser, {
          displayName: userName,
        })
          .then(() => {
            // Profile updated!
            // ...

            toaster.push(message("Signing successfull", "success"), {
              placement: "topEnd",
              duration: 5000,
            });
          })
          .catch((error) => {
            toaster.push(
              message("Unable to sign you in. Try again later", "error"),
              {
                placement: "topEnd",
                duration: 5000,
              }
            );
            console.log(error);
          });
      else
        toaster.push(message("Incorrect email or password", "warning"), {
          placement: "topEnd",
          duration: 5000,
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          toaster.push(message("Loging Succeessfull", "success"), {
            placement: "topEnd",
            duration: 5000,
          });
          const user = userCredential.user;

          console.log(user);
          updateProfile(auth.currentUser, {
            displayName: userName,
          })
            .then(() => {
              toaster.push(message("Updating info...", "info"), {
                placement: "topEnd",
                duration: 5000,
              });
              navigate("/");
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toaster.push(
            message(
              `Unable to login. Try again sometime\n ${errorMessage}`,
              "error",
              errorCode
            ),
            {
              placement: "topEnd",
              duration: 5000,
            }
          );
          // ..
        });
    }
  };

  return (
    <Panel {...props} ref={ref} header={<h3>Signup</h3>} bordered>
      <Form>
        <Form.Group controlId="name">
          <Form.ControlLabel>Name</Form.ControlLabel>
          <Form.Control
            name="name"
            type="text"
            onChange={(value) => setUserName(value)}
          />
          <Form.HelpText tooltip>Name is required</Form.HelpText>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.ControlLabel>Email</Form.ControlLabel>
          <Form.Control
            name="email"
            type="email"
            onChange={(value) => setEmail(value)}
          />
          <Form.HelpText tooltip>Email is required</Form.HelpText>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.ControlLabel>Password</Form.ControlLabel>
          <Form.Control
            name="password"
            type="password"
            autoComplete="off"
            onChange={(value) => setPassword(value)}
          />
        </Form.Group>
        <Form.Group>
          <ButtonToolbar>
            <Button appearance="primary" onClick={sigUp}>
              Submit
            </Button>
            <Button appearance="default" onClick={() => navigate("/login")}>
              Login Instead
            </Button>
          </ButtonToolbar>
        </Form.Group>
      </Form>
    </Panel>
  );
});

export default function SignUp() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // backgroundImage: `url(${bg})`,
        // backgroundPosition: "center",
        // backgroundRepeat: "no-repeat",
        // backgroundSize: "cover",
      }}
    >
      <Stack
        spacing={6}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Animate children={SignupComponent} />
      </Stack>
    </div>
  );
}
