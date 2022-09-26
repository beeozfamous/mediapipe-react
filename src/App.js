import {FaceDetection} from '@mediapipe/face_detection';
import React, {useRef, useEffect} from "react";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import  * as drawingUtils from '@mediapipe/drawing_utils'


function App() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    var camera = null;

    function onResults(results) {
        // const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set canvas width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext("2d");
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height);
        if (results.detections.length > 0) {
            drawingUtils.drawRectangle(
                canvasCtx, results.detections[0].boundingBox,
                {color: 'blue', lineWidth: 4, fillColor: '#00000000'});
            drawingUtils.drawLandmarks(canvasCtx, results.detections[0].landmarks, {
                color: 'red',
                radius: 5,
            });
        }
        canvasCtx.restore();
    }

    // }

    // setInterval(())
    useEffect(() => {
        const faceDetection = new FaceDetection({
            locateFile: (file) => {
                console.log('faceDetection', 'loading', file);
                console.log(`./assets/models/faceDetection/${file}`)
                // return `./assets/models/faceDetection/${file}`;
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4.1646425229/${file}`;

            }
        });

        faceDetection.setOptions({
            modelSelection: 'full',
            minDetectionConfidence: 0.5
        });
        faceDetection.onResults(onResults);

        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null
        ) {
            camera = new cam.Camera(webcamRef.current.video, {
                onFrame: async () => {
                    await faceDetection.send({image: webcamRef.current.video});
                },
                width: 640,
                height: 480,
            });
            camera.start();
        }
    }, []);
    return (
        <center>
            <div className="App">
                <Webcam
                    ref={webcamRef}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        width: 640,
                        height: 480,
                    }}
                />{" "}
                <canvas
                    ref={canvasRef}
                    className="output_canvas"
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        width: 640,
                        height: 480,
                    }}
                ></canvas>
            </div>
        </center>
    );
}

export default App;
