/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-undef */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/display-name */
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Panel,
  FlexboxGrid,
  RadioTile,
  RadioTileGroup,
  Stack,
  Loader,
  Button,
  Notification,
  ButtonToolbar,
} from "rsuite";
import { Icon } from "@rsuite/icons";
import { BiMicrophone, BiSolidWebcam, BiSolidInfoCircle } from "react-icons/bi";
import { Message, useToaster } from "rsuite";
import { ref, onValue } from "firebase/database";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import Animate from "../components/Animate";
import { styled } from "styled-components";
import CustomModal from "../components/CustomModal";
import CustomChart from "../components/CustomChart";
import ObjectDetect from "../components/ObjectDetect";
// import bg from "../assets/s_l_bg.png";
// import ppp from "../assets/ppp.jpg";
import { useNavigate } from "react-router-dom";
import { sendEmail } from "../services/mailService";
import CustomProgress from "../components/CustomProgress";
import CustomProgressBig from "../components/CustomProgressBig";
import { auth, database } from "../services/fireBase";

// const I = ppp;

const MessagePop = React.forwardRef(
  ({ types, setShowNoti, setSendMail, ...rest }, ref) => {
    return (
      <Notification ref={ref} {...rest} type={types} header={types}>
        <NotiContent>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni illo
          cupiditate repellat praesentium placeat ipsum dolorem ea doloribus?
          <CountdownCircleTimer
            isPlaying
            size={100}
            duration={60}
            onComplete={() => {
              setShowNoti(false);
              setSendMail(true);
            }}
            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={[60, 40, 20, 8]}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
        </NotiContent>
        <FlexboxGrid justify="end">
          <ButtonToolbar>
            <Button
              appearance="primary"
              color="red"
              onClick={() => {
                setShowNoti(false);
                setSendMail(false);
              }}
            >
              Abort
            </Button>
            <Button
              appearance="primary"
              color="cyan"
              onClick={() => {
                setShowNoti(false);
                setSendMail(true);
              }}
            >
              Send
            </Button>
          </ButtonToolbar>
        </FlexboxGrid>
      </Notification>
    );
  }
);

const ReportPageComponent = React.forwardRef((props, _ref) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = useState("");
  const [model, setModel] = useState();
  const [predictonModel, setPredictionModel] = useState();
  const [loading, setLoading] = useState(false);
  const [showNoti, setShowNoti] = useState(false);
  const [sendMail, setSendMail] = useState(false);

  const maxDecibelRef = useRef(0);
  const navigate = useNavigate();

  const toaster = useToaster();

  let decibelsReadings = useMemo(() => [], []);
  let photos = [];

  const readImages = ref(database, "esp32-cam/");
  onValue(readImages, (snapshot) => {
    const data = snapshot.val();
    photos = [...photos, data.photo];
  });

  // const today = new Date().setHours(0, 0, 0, 0);
  // const thatDay = new Date(data[key].timestamp).setHours(0, 0, 0, 0);

  const readSoundDecibels = ref(database, "Data/");
  onValue(readSoundDecibels, (snapshot) => {
    const data = snapshot.val();
    Object.keys(data).forEach((key) => {
      decibelsReadings = [
        ...decibelsReadings,
        {
          ...data[key],
        },
      ];
    });
  });

  maxDecibelRef.current = Math.max(
    ...decibelsReadings
      .slice(decibelsReadings.length - 50)
      .map((d) => d.Decibels)
  );

  const message = useMemo(() => {
    return (
      <Message showIcon type={"success"} closable>
        Email Successfully Sent
      </Message>
    );
  }, []);

  const errorMsg = useMemo(() => {
    return (
      <Message showIcon type={"error"} closable>
        Unable To Send Mail
      </Message>
    );
  }, []);

  useEffect(() => {
    maxDecibelRef.current > 80 && setShowNoti(true);
  }, [decibelsReadings]);

  useEffect(() => {
    if (!model && !predictonModel)
      (async () => {
        setLoading(true);
        const _predictionModel = await mobilenet.load();
        setPredictionModel(_predictionModel);
        const _model = await cocoSsd.load();
        setModel(_model);
        setLoading(false);
      })();
  }, [model, predictonModel]);

  const handleRadioChange = (value) => {
    setValue(value);
  };

  const _img = document.getElementById("img");
  if (_img) _img.src = `data:image/png;base64,${photos[0]}`;

  const component =
    value === "cam" ? (
      <ObjectDetect img={_img} model={model} predictonModel={predictonModel} />
    ) : value === "mic" ? (
      <CustomChart data={decibelsReadings} />
    ) : (
      <CustomProgressBig db={maxDecibelRef.current} />
    );

  const title =
    value === "cam"
      ? "Camera Output"
      : value === "mic"
      ? "Microphone Output"
      : "Inference";

  useEffect(() => {
    if (sendMail && auth.currentUser.email) {
      const data = {
        to_name: "Adams Eugene",
        message: "The Best",
        reply_to: "gracywiredu@gmail.com",
        mail_to: auth.currentUser.email,
      };
      sendEmail(
        data,
        () => toaster.push(message, { placement: "topEnd", duration: 5000 }),
        () => toaster.push(errorMsg, { placement: "topEnd", duration: 5000 })
      );
    }
    setSendMail(false);
  }, [errorMsg, message, sendMail, toaster]);

  return (
    <Panel
      {...props}
      ref={_ref}
      header={
        <FlexboxGrid>
          <FlexboxGrid.Item colspan={18}>
            <h3>Today&apos;s Report</h3>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={6}>
            <FlexboxGrid justify="end">
              <Button
                appearance="primary"
                onClick={() =>
                  navigate("/report/view", {
                    state: { data: decibelsReadings },
                  })
                }
              >
                View Reports
              </Button>
            </FlexboxGrid>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      }
    >
      {loading ? (
        <div style={{ height: "80vh" }}>
          <Loader
            backdrop
            content="loading Image Detection Models ..."
            vertical
            size="lg"
          />
        </div>
      ) : (
        <Stack direction="column" alignItems="center" spacing={32}>
          <Panel>
            <h2>Click On Item To Display Info On It</h2>
          </Panel>
          <Selectors>
            <RadioTileGroup
              onChange={handleRadioChange}
              inline
              aria-label="Create new project"
            >
              <RadioTile onClick={() => setOpen(true)} value="mic">
                <ItemWrapper>
                  <Image>
                    <Icon as={BiMicrophone} size="10rem" />
                  </Image>
                  <TextCom>
                    You can make informed decisions and take proactive steps to
                    protect our precious environment from our microphone feeds.
                  </TextCom>
                </ItemWrapper>
              </RadioTile>
              <RadioTile onClick={() => setOpen(true)} value="cam">
                <ItemWrapper2>
                  <Image>
                    <Icon as={BiSolidWebcam} size="10rem" />
                  </Image>
                  <TextCom2>
                    Our camera feeds complement data from our microphone,
                    allowing you to visually assess the impact of different
                    factors on our ecosystems. Use this valuable visual
                    information to support environmental awareness.
                  </TextCom2>
                </ItemWrapper2>
              </RadioTile>
              <RadioTile onClick={() => setOpen(true)} value="cir">
                <ItemWrapper>
                  <Image>
                    <Icon as={BiSolidInfoCircle} size="10rem" />
                  </Image>
                  <TextCom>
                    <CustomProgress db={maxDecibelRef.current} />
                  </TextCom>
                </ItemWrapper>
              </RadioTile>
            </RadioTileGroup>
          </Selectors>
          <Pop>
            <Animate
              types="warning"
              inn={showNoti}
              setShowNoti={setShowNoti}
              setSendMail={setSendMail}
              children={MessagePop}
            />
          </Pop>
          <img id="img" height={400} hidden crossOrigin="anonymous" />
        </Stack>
      )}
      <CustomModal
        open={open}
        setOpen={setOpen}
        size={"lg"}
        children={component}
        title={title}
      />
    </Panel>
  );
});

export default function ReportPage() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <FlexboxGrid justify="center">
        <FlexboxGrid.Item colspan={18}>
          <Animate children={ReportPageComponent} />
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </div>
  );
}

const ItemWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  padding-top: 100px;
`;

const ItemWrapper2 = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400px;
  padding-top: 100px;
`;

const Image = styled.div`
  position: absolute;
  top: -20px;
  z-index: 99;

  .rs-icon {
  }
`;

const TextCom = styled.div`
  height: 400px;
  width: 300px;
  padding: 8px;
  padding-top: 50px;
  border: 1px solid #ccc;
  text-align: center;
`;

const TextCom2 = styled.div`
  height: 500px;
  width: 300px;
  padding: 8px;
  padding-top: 100px;
  border: 1px solid #ccc;
  text-align: center;
`;

const Selectors = styled.div`
  .rs-radio-tile {
    border-color: transparent;
  }
  .rs-radio-tile-checked,
  .rs-radio-tile:hover:not(.rs-radio-tile-disabled) {
    border-color: transparent;
  }

  .rs-radio-tile:hover {
    ${TextCom} {
      border-color: #ccc;
    }
    ${TextCom2} {
      border-color: #ccc;
    }
  }
`;

const Pop = styled.div`
  position: absolute;
  top: 5rem;
  right: 2px;
  z-index: 555;
`;

const NotiContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;
