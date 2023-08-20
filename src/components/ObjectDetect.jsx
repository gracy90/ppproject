/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Loader, Panel, Stack, Tag, TagGroup } from "rsuite";
import { styled } from "styled-components";
import { drawRect } from "./draw";

const known = ["crane", "forklift", "harvester", "reaper", "truck", "person"];

export default function ObjectDetect({
  model,
  img,
  predictonModel,
  setMaxScore,
}) {
  const [predicting, setPredicting] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [otherPredictions, setOtherPredictions] = useState([]);
  const [results, setResults] = useState([]);
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
        setOtherPredictions(rec);
        // console.log(rec);
        setTimeout(() => {
          setPredicting(false);
        }, 1000);
        setPredictions(predictions);
        // console.log("Predictions: ", predictions);
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

  useEffect(() => {
    setResults([]);
  }, []);

  // const PredictedObjects = predictions.map((pre) => `${pre.class} `);
  const score = results.map((p) => +p.probability);
  const max = Math.max(...score);

  useEffect(() => {
    setMaxScore(max);
  }, [max, setMaxScore]);

  // {
  //   className: pre.className,
  //   prop: pre.probability,
  // }

  useEffect(() => {
    predictions?.forEach((pre) => {
      // console.log(pre);
      if (known.includes(pre.class)) {
        setResults((p) => [
          ...p,
          { name: pre.class, probability: pre.score * 100 },
        ]);
      } else {
        setResults((p) => [...p, { name: pre.class, probability: 0 }]);
      }
    });
  }, [predictions]);

  useEffect(() => {
    otherPredictions?.forEach((pre) => {
      const items = pre.className.split(",");
      items?.forEach((item) => {
        if (known?.includes(item)) {
          setResults((p) => [
            ...p,
            { name: item, probability: pre.probability * 100 },
          ]);
        } else {
          setResults((p) => [...p, { name: item, probability: 0 }]);
        }
      });
    });
  }, [otherPredictions]);

  const res = [...new Set(results.map((item) => item.name))]; // [ 'A', 'B']

  return (
    <Panel
      header={
        <Stack direction="row">
          {predicting ? (
            <h3>Wait a minute whiles we detect objects in this image</h3>
          ) : (
            res.map((re) => (
              <TagGroup key={re}>
                <Tag size="lg">{re}</Tag>
              </TagGroup>
            ))
          )}
        </Stack>
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
