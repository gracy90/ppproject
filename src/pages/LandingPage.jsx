/* eslint-disable react/no-unknown-property */
/* eslint-disable no-undef */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/display-name */
import React, { useEffect } from "react";
import {
  Panel,
  FlexboxGrid,
  Stack,
  Dropdown,
  IconButton,
  Message,
  useToaster,
} from "rsuite";
import { Nav } from "rsuite";
import HomeIcon from "@rsuite/icons/legacy/Home";
import { BiSolidReport } from "react-icons/bi";
import UserChangeIcon from "@rsuite/icons/UserChange";
import { Icon } from "@rsuite/icons";
import { signOut } from "firebase/auth";

import Animate from "../components/Animate";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/fireBase";

const renderIconButton = (props, ref) => {
  return (
    <IconButton
      {...props}
      ref={ref}
      icon={<UserChangeIcon />}
      circle
      color="blue"
      appearance="primary"
    />
  );
};

const HomeComponent = React.forwardRef((props, ref) => {
  const toaster = useToaster();
  const navigate = useNavigate();

  const message = (message, type) => {
    return (
      <Message showIcon type={type} closable>
        {message}
      </Message>
    );
  };

  useEffect(() => {
    toaster.push(
      message(`Welcome ${auth.currentUser?.displayName || "User"}`, "info"),
      {
        placement: "topEnd",
        duration: 5000,
      }
    );
  }, [toaster]);

  const _signOut = () => {
    auth.currentUser &&
      toaster.push(message("Loging out...", "info"), {
        placement: "topEnd",
        duration: 500,
      });
    auth.currentUser &&
      signOut(auth)
        .then(() => {
          navigate("/login", { replace: true });
        })
        .catch((error) => {
          toaster.push(message("Unable to log out. Try again later", "error"), {
            placement: "topEnd",
            duration: 5000,
          });
          console.log(error);
        });
    !auth.currentUser && navigate("/login");
  };

  return (
    <Panel
      {...props}
      ref={ref}
      style={{ height: "98vh" }}
      header={
        <Stack justifyContent="space-between">
          <h3>Home</h3>
        </Stack>
      }
    >
      <FlexboxGrid>
        <FlexboxGrid.Item colspan={18}>
          {/* <Stack spacing={32}> */}
          <Nav>
            <Nav.Item icon={<HomeIcon />}>Home</Nav.Item>
            <Nav.Item
              icon={<Icon as={BiSolidReport} />}
              onClick={() => navigate("/report")}
            >
              Reports
            </Nav.Item>
          </Nav>
          {/* </Stack> */}
        </FlexboxGrid.Item>
        <Dropdown renderToggle={renderIconButton} placement="bottomEnd">
          <Dropdown.Item>Update</Dropdown.Item>
          <Dropdown.Item onClick={_signOut}>
            {auth.currentUser ? "Logout" : "Login"}
          </Dropdown.Item>
        </Dropdown>
        <FlexboxGrid.Item colspan={6}></FlexboxGrid.Item>
      </FlexboxGrid>
      <FlexboxGrid justify="center" align="middle"></FlexboxGrid>
    </Panel>
  );
});

export default function ReportView() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <FlexboxGrid justify="center">
        <FlexboxGrid.Item colspan={18}>
          <Animate children={HomeComponent} />
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </div>
  );
}
