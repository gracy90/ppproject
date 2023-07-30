import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import carrouselData from "../data/CarrouselData";

export default function CustomCarrousel() {
  let [index, setIndex] = useState(0);

  useEffect(()=>{
    if(index>carrouselData.length-2){
      setIndex(0)
    }
    else{
      setTimeout(()=>{
        setIndex(()=>index++);
      },3000)
      
    }
  },[index])

  return (
    <CarrouselContainer style={{backgroundImage:`url(../src/assets/galaImages/${carrouselData[index].image})`,backgroundSize:'cover',}}>
      <Content>{carrouselData[index].content}</Content>
    </CarrouselContainer>
  );
}

const CarrouselContainer = styled.div`
  margin-top: 15px;
  height: 75vh;
  border-radius: 15px;
  justify-content:center;
  display:flex;
  background-blend-mode:multiply;
  background-color:hsl(22, 89%, 42%);
`;

const Content=styled.p`
font-weight:bold;
font-size:20px;
color:white;
margin-top:auto;
margin-bottom:10px;
`
