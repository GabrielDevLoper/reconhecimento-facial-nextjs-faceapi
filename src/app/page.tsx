'use client'

import { useEffect, useRef } from "react";
import Header from "./components/Header";
import LoadingSpinner from "./components/LoadingSpinner";

import * as faceapi from 'face-api.js';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
      const videoElement =  videoRef.current;

      if(videoElement){
        videoElement.srcObject = stream;
      }
    });

  }, []);

  useEffect(() => {
    // carregando modelos a ser utilizado da faceapi
    Promise.all([
      faceapi.loadTinyFaceDetectorModel('/models'),
      faceapi.loadFaceLandmarkModel('/models'),
      faceapi.loadFaceExpressionModel('/models'),
    ]).then(() => {
      console.log('models loadead');
    })

  }, [])

  async function handleLoadedMetadata(){
    const videoElement =  videoRef.current as HTMLVideoElement;
    const canvasElement = canvasRef.current as HTMLCanvasElement;

    if( !videoElement || !canvasElement) return;

    const detection = await faceapi.detectSingleFace(videoElement as HTMLVideoElement, 
      new faceapi.TinyFaceDetectorOptions)
      .withFaceLandmarks()
      .withFaceExpressions();

    if(detection){
      // obtendo dimensções do video no browser de forma responsiva
      const dimensions = {
        width: videoElement?.offsetWidth,
        height: videoElement?.offsetHeight
      };

      // aprimorar o encontro da face
      faceapi.matchDimensions(canvasElement, dimensions);
      const resizedResults =faceapi.resizeResults(detection, dimensions);

      faceapi.draw.drawDetections(canvasElement, resizedResults);
      faceapi.draw.drawFaceLandmarks(canvasElement, resizedResults);
      faceapi.draw.drawFaceExpressions(canvasElement, resizedResults);

    }

    setTimeout(() => {
      handleLoadedMetadata();
    }, 1000);
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row md:justify-between gap-14 xl:gap-40 p-10 items-center container mx-auto">
    <Header />
    <section className="flex flex-col gap-6 flex-1 w-full">
      <div className="bg-white rounded-xl p-2">
        <div className="relative flex items-center justify-center aspect-video w-full">
          {/* Substitua pela Webcam */}
          <div className="aspect-video rounded-lg bg-gray-300 w-full">
            <div className="relative">
              <video 
              onLoadedMetadata={handleLoadedMetadata}
              ref={videoRef} 
              autoPlay
              className="rounded aspect-video"
              ></video>
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
            </div>
          </div>
          {/* Substitua pela Webcam */}
        </div>
      </div>
      <div
        className={`bg-white rounded-xl px-8 py-6 flex gap-6 lg:gap-20 items-center h-[200px] justify-center`}
      >
        <p className="text-4xl text-center flex justify-center items-center text-yellow-300">
          {/* Substitua pelo texto */}
          <LoadingSpinner />
          {/* Substitua pelo texto */}
        </p>
      </div>
    </section>
  </main>
  );
}
