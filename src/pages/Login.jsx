/* eslint-disable react/no-children-prop */
/* eslint-disable react/display-name */
import React, { useState } from "react";
import {
  Form,
  ButtonToolbar,
  Button,
  Stack,
  Panel,
  useToaster,
  Message,
} from "rsuite";
import { signInWithEmailAndPassword } from "firebase/auth";

import Animate from "../components/Animate";
import { auth } from "../services/fireBase";
import { useNavigate } from "react-router-dom";
// import bg from "../assets/s_l_bg.png";

const LoginComponent = React.forwardRef((props, ref) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const toaster = useToaster();
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

  const login = () => {
    toaster.push(message("Loging in...", "info"), {
      placement: "topEnd",
      duration: 5000,
    });
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        toaster.push(message("Loging Succeessfull", "success"), {
          placement: "topEnd",
          duration: 5000,
        });
        const user = userCredential.user;
        navigate("/");
        console.log(user);
        // ...
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
  };

  return (
    <Panel {...props} ref={ref} header={<h3>Login</h3>} bordered>
      <Form>
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
            <Button appearance="primary" onClick={login}>
              Submit
            </Button>
            <Button appearance="default" onClick={() => navigate("/signup")}>
              Signup
            </Button>
          </ButtonToolbar>
        </Form.Group>
      </Form>
    </Panel>
  );
});

export default function Login() {
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
        <Animate children={LoginComponent} />
      </Stack>
    </div>
  );
}
