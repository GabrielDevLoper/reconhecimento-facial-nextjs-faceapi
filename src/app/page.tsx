'use client'

import { useRef, useState } from "react";
import Header from "./components/Header";

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
  const [capturedPhoto, setCapturedPhoto] = useState<string>();
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

  function capturePhoto() {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;

    if (!videoElement || !canvasElement) return;

    const context = canvasElement.getContext('2d');
    if (!context) return;

    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    // Convertendo o canvas para base64
    const photoData = canvasElement.toDataURL('image/png');
    setCapturedPhoto(photoData);
  }

  function downloadPhoto() {
    if (!capturedPhoto) return;

    const link = document.createElement('a');
    link.href = capturedPhoto;
    link.download = 'captured_photo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          {/* @ts-ignore */}
          <ResultMessage expression={expression}/>

        
        </p>
        <p className="text-2xl text-center flex justify-center items-center text-black">
          
          Sua idade estimada é: {age !== undefined ? age.toString() : ''}
        </p>

        <p className="text-2xl text-center flex justify-center items-center text-black">
        seu genero é: {gender}
        </p>

        <button
            onClick={capturePhoto}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Capturar Foto
          </button>
          {capturedPhoto && (
            <div>
              <h2>Foto Capturada:</h2>
              <img src={capturedPhoto} alt="Captured" />
              <button
                onClick={downloadPhoto}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Baixar Foto
              </button>
            </div>
          )}
      </div>
    </section>
  </main>
  );
}
