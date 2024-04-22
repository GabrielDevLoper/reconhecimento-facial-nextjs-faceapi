import { useEffect } from "react";

export default function useWebcam(videoRef : {current: HTMLVideoElement | null}){
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
          const videoElement =  videoRef.current;
    
          if(videoElement){
            videoElement.srcObject = stream;
          }
        });
    
      }, []);
}