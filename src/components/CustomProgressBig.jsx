/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Progress } from "rsuite";
import { styled } from "styled-components";

export default function CustomProgressBig({ db, score }) {
  const max = Math.max(db, score);
  return (
    <CustomProgressBigWrapper>
      <Progress.Line
        vertical
        percent={+score?.toFixed(2)}
        // status={score >= 80 ? "fail" : score < 50 ? "success" : "active"}
        strokeWidth={130}
      />
      <Progress.Line vertical percent={db} strokeWidth={130} />
      <Progress.Line
        vertical
        percent={max}
        status={max >= 80 ? "fail" : max < 50 ? "success" : "active"}
        strokeWidth={130}
      />
      <Text1>Camera</Text1>
      <Text2>Sound</Text2>
      <Text3>Inference</Text3>
    </CustomProgressBigWrapper>
  );
}

const CustomProgressBigWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  height: 500px;
  padding-bottom: 50px;
  /* width: 700px; */
`;

const Text1 = styled.div`
  position: absolute;
  bottom: 20px;
  left: 130px;
`;
const Text2 = styled.div`
  position: absolute;
  bottom: 20px;
`;
const Text3 = styled.div`
  position: absolute;
  bottom: 20px;
  right: 130px;
`;
