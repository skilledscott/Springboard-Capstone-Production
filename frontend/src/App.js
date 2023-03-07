import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs'
import * as cocossd from '@tensorflow-models/coco-ssd';

import './styles/mystyles.css';

const App = () => {
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [model, setModel] = useState(null);

    const canvasRef = useRef(null);


    // On page start, load ssd model
    useEffect(() => {
        loadModel().then((model) => {
            setIsLoading(false);
            setModel(model);
        });
    }, [])

    // Loads and returns ssd model
    const loadModel = async () => {
        const model = await cocossd.load();
        return model;
    }


    // Init the canvas on page load by setting the size and setting fill to black
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Fill canvas
        context.fillStyle = '#000000';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }, [])


    useEffect(() => {
        if (imageURL == null) return;

        var img = new Image();
        img.src = imageURL;
        img.onload = () => {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            context.drawImage(img, 0, 0);
        }
    }, [imageURL])


    // On user image upload, set the imageURL state to point to the created image blob
    const onImageChange = (e) => {
        setImage(e.target.files[0]);
        setImageURL(URL.createObjectURL(e.target.files[0]));
    }


    // On pressing the predict button, call the model to detect
    const handlePredict = () => {
        model.detect(canvasRef.current).then(preds => {
            console.log('prediction: ', preds);
            drawBBoxes(preds);
        });
    }


    const drawBBoxes = (preds) => {
        const pred = preds[0];
        const x = pred.bbox[0];
        const y = pred.bbox[1];
        const width = pred.bbox[2];
        const height = pred.bbox[3];

        const canvas = document.getElementById('image-canvas');
        const ctx = canvas.getContext('2d');

        console.log('here')

        ctx.strokeRect(x, y, width, height);
    }


    return (
        <div>
            {/* Hero component */}
            <div className='hero is-primary'>
                <div className='hero-body'>
                    <p className='title'>
                        Object Detection Capstone Project
                    </p>
                    <p className='subtitle'>
                        Created by Scott Gibson
                    </p>
                </div>
            </div>

            {/* Columns */}
            <div className='columns is-mobile mt-4'>
                {/* left column - Image Input and User Buttons */}
                <div className='column'>
                    {/* User Uploaded Image */}
                    <canvas ref={canvasRef} width='416' height='416' />

                    <div className='file is-warning'>
                        {/* Image File Input */}
                        <label className='file-label'>
                            <input className='file-input'
                                type='file'
                                accept='image/*'
                                name='input-image'
                                onChange={onImageChange}
                            />
                            <span className='file-cta'>
                                {/* <span className='file-icon'>
                                    <i className='fas fa-upload'></i>
                                </span> */}
                                <span className='file-label'>
                                    Upload
                                </span>
                            </span>
                        </label>
                        {/* Predict Button */}
                        <button className='button is-success ml-2' onClick={handlePredict}>
                            Predict
                        </button>
                    </div>
                </div>

                {/* right column - Nothing yet */}
                <div className='column'>
                    <p className='title'>Unused Column</p>
                    <p>{isLoading ? 'Loading model...' : 'Model Loaded'}</p>
                </div>
            </div>
        </div >
    );
}

export default App;
