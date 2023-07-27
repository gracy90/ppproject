/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Progress } from "rsuite";
import { styled } from "styled-components";

export default function CustomProgress({ db }) {
  return (
    <CustomProgressWrapper>
      <Progress.Line
        vertical
        percent={db}
        status={db >= 80 ? "fail" : db < 50 ? "success" : "active"}
        strokeWidth={40}
      />
      <Progress.Line
        vertical
        percent={db}
        status={db >= 80 ? "fail" : db < 50 ? "success" : "active"}
        strokeWidth={40}
      />
      <Progress.Line vertical percent={100} status="success" strokeWidth={40} />
      <Text1>Camera</Text1>
      <Text2>Sound</Text2>
      <Text3>inference</Text3>
    </CustomProgressWrapper>
  );
}

const CustomProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100px;
  /* width: 700px; */
`;

const Text1 = styled.div`
  position: absolute;
  bottom: 20px;
  left: 60px;
`;
const Text2 = styled.div`
  position: absolute;
  bottom: 20px;
`;
const Text3 = styled.div`
  position: absolute;
  bottom: 20px;
  right: 55px;
`;
