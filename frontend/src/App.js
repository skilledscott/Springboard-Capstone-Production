import { useState, useEffect, useRef } from 'react';
import * as cocossd from '@tensorflow-models/coco-ssd';

import './styles/mystyles.css';

const App = () => {
    const [imageURL, setImageURL] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [model, setModel] = useState(null);
    const [preds, setPreds] = useState([]);

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


    useEffect(() => {
        // clear canvas content and fill to black on page load, and image redraw
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.fillStyle = '#000000';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        // if imageURL is null, there is no image to draw
        if (imageURL == null) return;

        // create a new image to put in the canvas, set it's url to the user uploaded image blob
        var img = new Image();
        img.src = imageURL;
        img.onload = () => {
            const canvasDim = [canvas.width, canvas.height];
            const imageDim = [img.width, img.height];

            // scale the image to fit in the canvas while keeping its aspect ratio
            const largerIdx = img.width >= img.height ? 0 : 1;
            const rat = canvasDim[largerIdx] / imageDim[largerIdx];

            const imgWidthScaled = img.width * rat;
            const imgHeightScaled = img.height * rat;

            const dx = (canvas.width - imgWidthScaled) / 2;
            const dy = (canvas.height - imgHeightScaled) / 2;

            // draw the image in the canvas
            context.drawImage(img, 0, 0, img.width, img.height, dx, dy, imgWidthScaled, imgHeightScaled);
        }
    }, [imageURL])


    // On user image upload, set the imageURL state to point to the created image blob
    const onImageChange = (e) => {
        if (!e.target.files[0]) return;
        setPreds([])
        setImageURL(URL.createObjectURL(e.target.files[0]));
    }


    // On pressing the predict button, call the model to detect
    const handlePredict = () => {
        model.detect(canvasRef.current).then(preds => {
            setPreds(preds);
            drawBoxes(preds);
        });
    }


    const drawBoxes = (preds) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.strokeStyle = 'red';
        context.lineWidth = 3;

        console.log(preds);
        preds.forEach(pred => {
            const x = pred.bbox[0];
            const y = pred.bbox[1];
            const width = pred.bbox[2];
            const height = pred.bbox[3];

            context.strokeRect(x, y, width, height);
        })
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
            <div className='columns mt-4'>
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
                    <p className={`title is-2 ${isLoading ? 'has-text-danger' : 'has-text-success'}`}>
                        Coco-ssd Object Detection Model
                    </p>
                    <p className='is-size-4 has-text-weight-semibold mb-3'>
                        Discovered objects: confidence score
                    </p>
                    {preds.map((pred, _id) => {
                        return (
                            <div key={_id}>
                                <p>{preds[_id]['class']}: {preds[_id]['score']}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div >
    );
}

export default App;
