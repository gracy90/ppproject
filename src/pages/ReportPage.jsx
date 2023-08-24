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
  Avatar,
  Dropdown,
  Modal,
} from "rsuite";
import { Icon } from "@rsuite/icons";
import { BiMicrophone, BiSolidWebcam, BiSolidInfoCircle } from "react-icons/bi";
import { Message, useToaster } from "rsuite";
import { ref, onValue } from "firebase/database";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import RemindIcon from "@rsuite/icons/legacy/Remind";

import Animate from "../components/Animate";
import { styled } from "styled-components";
import CustomModal from "../components/CustomModal";
import CustomChart from "../components/CustomChart";
import ObjectDetect from "../components/ObjectDetect";
// import bg from "../assets/s_l_bg.png";
import a from "../assets/a.jpg";
import b from "../assets/b.jpg";
import c from "../assets/c.webp";
import d from "../assets/d.png";

// import pp from "../assets/p.jpg";
// import Ga1 from "../assets/galaImages/Gala1.jpg";
// import Ga2 from "../assets/galaImages/Gala2.jpg";
// import Ga3 from "../assets/galaImages/Gala3.jpg";
// import Ga4 from "../assets/galaImages/Gala4.jpg";

import { useNavigate } from "react-router-dom";
import { sendEmail } from "../services/mailService";
import CustomProgress from "../components/CustomProgress";
import CustomProgressBig from "../components/CustomProgressBig";
import { auth, database } from "../services/fireBase";

const ReportPageComponent = React.forwardRef((props, _ref) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = useState("");
  const [model, setModel] = useState();
  const [predictonModel, setPredictionModel] = useState();
  const [loading, setLoading] = useState(false);
  const [showNoti, setShowNoti] = useState(false);
  const [sendMail, setSendMail] = useState(false);
  const [dataToChart, setDataToChart] = useState([]);
  const [isCa, setCa] = useState(true);
  const [activeIndex, setActiveIndex] = useState();
  const [loadingImg, setLoadingImg] = useState(false);
  const [cancled, setCancled] = useState(true);
  const [maxScore, setMaxScore] = useState(0);
  const [date, setDate] = useState();

  const [photo, setPhoto] = useState("");

  const maxDecibelRef = useRef(0);
  const navigate = useNavigate();

  const toaster = useToaster();

  let decibelsReadings = useMemo(() => [], []);

  useEffect(() => {
    const readImages = ref(database, "esp32-cam/");
    onValue(readImages, (snapshot) => {
      const data = snapshot.val();
      setPhoto(data.photo);
    });
  },[]);

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
  // =========================================================================================================
  maxDecibelRef.current = Math.max(
    ...decibelsReadings
      .filter((d) => d.timestamp >= date?.from && d.timestamp <= date?.to)
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
    if ((maxDecibelRef.current > 80 || maxScore > 80) && cancled) {
      setTimeout(() => {
        setShowNoti(true);
      }, 2000);
    }
  }, [cancled, decibelsReadings, maxScore]);

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
    if (value === "cam") {
      maxDecibelRef.current = 0;
      setMaxScore(0);
      setCancled(true);
    }
  };

  const onChangeDate = (from, to) => {
    setDate({ from, to });
    maxDecibelRef.current = 0;
    setCancled(true);
    setDataToChart(
      decibelsReadings.filter((d) => d.timestamp >= from && d.timestamp <= to)
    );
  };

  const dropdownSelect = (value) => {
    setLoadingImg(true);
    maxDecibelRef.current = 0;
    setValue("cam");
    setMaxScore(0);
    setCancled(true);
    setActiveIndex(value);
    setTimeout(() => {
      setOpen(true);
      setCa(false);
      setLoadingImg(false);
    }, 200);
  };

  const _img = document.getElementById("img");
  if (_img && !activeIndex) _img.src = `data:image/png;base64,${photo}`;

  const component =
    value === "cam" ? (
      <ObjectDetect
        img={_img}
        model={model}
        predictonModel={predictonModel}
        setMaxScore={setMaxScore}
      />
    ) : value === "mic" ? (
      <CustomChart data={dataToChart} />
    ) : (
      <CustomProgressBig db={maxDecibelRef.current} score={maxScore} />
    );

  const title =
    value === "cam"
      ? "Camera Output"
      : value === "mic"
      ? "Microphone Output"
      : "Inference";

  useEffect(() => {
    if (sendMail && auth.currentUser.email && auth.currentUser.displayName) {
      const data = {
        to_name: auth.currentUser.displayName,
        message: "Protecting the environment",
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
        <Stack direction="column" alignItems="center" spacing={16}>
          <Panel>
            <h2>Click On Item To Display Info On It</h2>
          </Panel>
          <ImageWrapper>
            <Dropdown
              title={"Load Image"}
              onSelect={dropdownSelect}
              loading={loadingImg}
            >
              <Dropdown.Item eventKey="a">
                <Avatar src={a} alt="@SevenOutman" />
              </Dropdown.Item>
              <Dropdown.Item eventKey="b">
                <Avatar src={b} alt="@SevenOutman" />
              </Dropdown.Item>
              <Dropdown.Item eventKey="c">
                <Avatar src={c} alt="@SevenOutman" />
              </Dropdown.Item>
              <Dropdown.Item eventKey="d">
                <Avatar src={d} alt="@SevenOutman" />
              </Dropdown.Item>
            </Dropdown>
          </ImageWrapper>
          <Selectors>
            <RadioTileGroup
              onChange={handleRadioChange}
              inline
              aria-label="Create new project"
            >
              <RadioTile
                onClick={() => {
                  setOpen(true);
                  setCa(true);
                }}
                value="mic"
              >
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
              <RadioTile
                onClick={() => {
                  setOpen(true);
                  setCa(false);
                }}
                value="cam"
              >
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
              <RadioTile
                onClick={() => {
                  setOpen(true);
                  setCa(false);
                }}
                value="cir"
              >
                <ItemWrapper>
                  <Image>
                    <Icon as={BiSolidInfoCircle} size="10rem" />
                  </Image>
                  <TextCom>
                    <CustomProgress
                      db={maxDecibelRef.current}
                      score={maxScore}
                    />
                  </TextCom>
                </ItemWrapper>
              </RadioTile>
            </RadioTileGroup>
          </Selectors>
          <Modal
            backdrop="static"
            role="alertdialog"
            open={showNoti}
            onClose={() => {
              setShowNoti(false);
            }}
            size="xs"
          >
            <Modal.Body>
              <RemindIcon style={{ color: "#ffb300", fontSize: 24 }} />
              sound {maxDecibelRef.current} image {maxScore}
              <NotiContent>
                <p>
                  Please select cancel to prevent an alert being sent to your
                  mail.
                </p>
                <CountdownCircleTimer
                  isPlaying
                  size={100}
                  duration={60}
                  onComplete={() => {
                    setShowNoti(false);
                    setSendMail(true);
                    setCancled(false);
                  }}
                  colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                  colorsTime={[60, 40, 20, 8]}
                >
                  {({ remainingTime }) => remainingTime}
                </CountdownCircleTimer>
              </NotiContent>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => {
                  setShowNoti(false);
                  setSendMail(true);
                  setCancled(false);
                }}
                appearance="primary"
              >
                Ok
              </Button>
              <Button
                onClick={() => {
                  setShowNoti(false);
                  setSendMail(false);
                  setCancled(false);
                }}
                appearance="subtle"
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>

          {activeIndex === "a" ? (
            <img id="img" height={400} src={a} hidden crossOrigin="anonymous" />
          ) : activeIndex === "b" ? (
            <img id="img" height={400} src={b} hidden crossOrigin="anonymous" />
          ) : activeIndex === "c" ? (
            <img id="img" height={400} src={c} hidden crossOrigin="anonymous" />
          ) : activeIndex === "d" ? (
            <img id="img" height={400} src={d} hidden crossOrigin="anonymous" />
          ) : (
            <img id="img" height={400} hidden crossOrigin="anonymous" />
          )}
        </Stack>
      )}
      <CustomModal
        open={open}
        setActiveIndex={setActiveIndex}
        setCancled={setCancled}
        setOpen={setOpen}
        size={"lg"}
        children={component}
        title={title}
        onChangeDate={onChangeDate}
        isCa={isCa}
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

const NotiContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const ImageWrapper = styled.div`
  position: absolute !important;
  top: 115px;
  right: 20px;
  z-index: 999;
`;
