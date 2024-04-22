import { useEffect } from "react";
import * as faceapi from 'face-api.js';

export default function useFaceApiModels(){
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
}