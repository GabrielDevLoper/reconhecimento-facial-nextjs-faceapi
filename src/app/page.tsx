'use client'

import { useEffect, useRef } from "react";
import Header from "./components/Header";
import LoadingSpinner from "./components/LoadingSpinner";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)


  console.log(videoRef.current);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
      const videoElement =  videoRef.current;

      if(videoElement){
        videoElement.srcObject = stream;
        videoElement.play();
      }
    });

  }, [])

  return (
    <main className="min-h-screen flex flex-col lg:flex-row md:justify-between gap-14 xl:gap-40 p-10 items-center container mx-auto">
    <Header />
    <section className="flex flex-col gap-6 flex-1 w-full">
      <div className="bg-white rounded-xl p-2">
        <div className="relative flex items-center justify-center aspect-video w-full">
          {/* Substitua pela Webcam */}
          <div className="aspect-video rounded-lg bg-gray-300 w-full">
            <video ref={videoRef} src=""></video>
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
