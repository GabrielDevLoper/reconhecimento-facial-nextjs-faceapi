'use client'

import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import LoadingSpinner from "./components/LoadingSpinner";

import * as faceapi from 'face-api.js';
import ResultMessage from "./components/ResultMessage";
import useWebcam from "./hooks/useWebcam";
import useFaceApiModels from "./hooks/useFaceApiModels";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [expression, setExpression] = useState<String>();
  const [age, setAge] = useState<Number>();
  const [gender, setGender] = useState<String>();

  useWebcam(videoRef);
  useFaceApiModels();
  
  async function handleLoadedMetadata(){
    const videoElement =  videoRef.current as HTMLVideoElement;
    const canvasElement = canvasRef.current as HTMLCanvasElement;

    if( !videoElement || !canvasElement) return;

    const detection = await faceapi.detectSingleFace(videoElement as HTMLVideoElement, 
      new faceapi.TinyFaceDetectorOptions)
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();

    if(detection){
      setExpression(detection.expressions.asSortedArray()[0].expression);

      // Obtenha as informações de idade e gênero
      const age = detection.age;
      const gender = detection.gender;

      console.log(age);
      console.log(gender);

      setAge(Math.round(age))
      setGender(gender === 'male' ? 'Masculino' : 'Feminino')

      // obtendo dimensções do video no browser de forma responsiva
      const dimensions = {
        width: videoElement?.offsetWidth,
        height: videoElement?.offsetHeight
      };

      // aprimorar o encontro da face
      faceapi.matchDimensions(canvasElement, dimensions);
      const resizedResults = faceapi.resizeResults(detection, dimensions);
      faceapi.draw.drawDetections(canvasElement, resizedResults);
      faceapi.draw.drawFaceLandmarks(canvasElement, resizedResults);
      faceapi.draw.drawFaceExpressions(canvasElement, resizedResults);

    }

    setTimeout(() => {
      handleLoadedMetadata();
    }, 500);
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row md:justify-between gap-14 xl:gap-40 p-10 items-center container mx-auto">
    <Header />
    <section className="flex flex-col gap-6 flex-1 w-full">
      <div className="bg-white rounded-xl p-2">
        <div className="relative flex items-center justify-center aspect-video w-full">
          <div className="aspect-video rounded-lg bg-gray-300 w-full">
            <div className="relative">
              <video 
              onLoadedMetadata={handleLoadedMetadata}
              ref={videoRef} 
              autoPlay
              className="rounded"
              ></video>
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`bg-white rounded-xl px-8 py-6 flex gap-6 lg:gap-20 items-center h-[200px] justify-center`}
      >
        <p className="text-2xl text-center flex justify-center items-center text-black">
          <ResultMessage expression={expression}/>

          
        </p>
        <p className="text-2xl text-center flex justify-center items-center text-black">
        sua idade estimada é: {age} anos
        </p>
        <p className="text-2xl text-center flex justify-center items-center text-black">
        seu genero é: {gender}
        </p>
      </div>
    </section>
  </main>
  );
}
