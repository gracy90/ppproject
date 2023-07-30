/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Loader, Panel } from "rsuite";
import { styled } from "styled-components";
import { drawRect } from "./draw";

export default function ObjectDetect({ model, img, predictonModel }) {
  const [predicting, setPredicting] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  

  useEffect(() => {
    (async () => {
      // Load the model.

      if (img) {
        // Classify the image.
        setPredicting(true);
        const predictions = await model.detect(img);
        const rec = await predictonModel.classify(img);
        console.log(rec);
        setTimeout(() => {
          setPredicting(false);
        }, 1000);
        setPredictions(predictions);
        console.log("Predictions: ", predictions);
      }
    })();
  }, [img, model, predictonModel]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = img.width;
      canvasRef.current.height = img.height;
      const ctx = canvasRef.current.getContext("2d");
      drawRect(predictions, ctx);
      // console.log(canvasRef.current);
    }
  });

  const PredictedObjects = predictions.map((pre) => `${pre.className} `);
  const score = predictions.map((p) => +p.score.toFixed(2));
  const max = Math.max(...score);
  console.log('max score'+max);

  return (
    <Panel
      header={
        <h3>
          {predicting
            ? "Wait a minute whiles we detect objects in this image"
            : PredictedObjects}
        </h3>
      }
    >
      {predicting ? (
        <div style={{ height: "400px" }}>
          <Loader
            backdrop
            content="loading Image Detection Models ..."
            vertical
            size="lg"
          />
        </div>
      ) : (
        <ImageWrapper>
          <img
            id="img"
            src={img.src}
            height={400}
            ref={imgRef}
            crossOrigin="anonymous"
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 8,
              width: 640,
              height: 480,
            }}
          />
        </ImageWrapper>
      )}
    </Panel>
  );
}

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

//before merging with grace
