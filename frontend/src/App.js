import { useState, useEffect, useRef } from 'react';
import * as cocossd from '@tensorflow-models/coco-ssd';
import * as ssdClasses from '@tensorflow-models/coco-ssd/dist/classes';

import './styles/mystyles.css';

const App = () => {
    /*********************************************************
     * State variables
     *********************************************************/

    const [imageURL, setImageURL] = useState('');            // string pointer to browser image blob
    const [isLoading, setIsLoading] = useState(true);        // set to true as model loads
    const [model, setModel] = useState(null);                // the tfjs model used in the web app
    const [modelInfo, setModelInfo] = useState(null);        // model meta information
    const [preds, setPreds] = useState([]);                  // list of predictions from model on image
    const [showInfo, setShowInfo] = useState(false);         // set to true when 'info' button is pressed
    const [allowPredict, setAllowPredict] = useState(false); // set to false after image predictions are fetched

    const canvasRef = useRef(null); // canvasRef.current returns the main canvas element


    /*********************************************************
     * Effect hooks
     *********************************************************/

    // On page render: load ssd model using the loadModel() function
    useEffect(() => {
        loadModel().then((model) => {
            setIsLoading(false);
            setModel(model);
        });
    }, [])

    // Loads and returns the npm installed coco-ssd model
    const loadModel = async () => {
        const model = await cocossd.load();
        return model;
    }


    // On page render: get model meta information and store in modelInfo state var
    useEffect(() => {
        // collect all classes the model recognizes into classArr
        let classArr = [];
        for (let key in ssdClasses.CLASSES) {
            classArr.push(ssdClasses.CLASSES[key]['displayName']);
        }

        /* 
         * Map the list into a notification that will display whenever the 'info' button
         * is pressed.
         */
        setModelInfo(
            <div className='notification is-info'>
                {classArr.map((elem, _id) => <p key={_id}>{elem}</p>)}
            </div>
        );
    }, [])


    // On imageURL change: draw the new imageURL on the canvas.
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // clear canvas content and fill to black on page load, and image redraw
        context.fillStyle = '#000000';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        // if imageURL is null, return, as there is no image to draw
        if (imageURL == null) return;

        // create a new image to put in the canvas, set it's url to the imageURL
        var img = new Image();
        img.src = imageURL;
        img.onload = () => {
            /* 
             * After the image finishes loading, scale the image to the canvas size
             * while maintaining its aspect ratio.
             */
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
            setAllowPredict(true);
        }
    }, [imageURL])


    /*********************************************************
     * Functions
     *********************************************************/

    /*
     * onImageChange: onChange function
     *
     * @param e: event object generated from <input> onChange event
     * 
     * When the 'upload' file input finishes, take the first file in the event 'e' object,
     * and create the imageURL using URL.createObjectURL. Note that since the file input
     * only accepts image type files, that logic is done already, and we don't need to
     * check that we are being given an image.
     */
    const onImageChange = (e) => {
        if (!e.target.files[0]) return;
        setPreds([])
        setImageURL(URL.createObjectURL(e.target.files[0]));
    }


    /*
     * handlePredict: onClick function
     * 
     * Query the object detection model to get predictions. When those are found, set the
     * preds state var and draw bounding boxes over the canvas.
     */
    const handlePredict = () => {
        model.detect(canvasRef.current).then(preds => {
            setPreds(preds);
            drawBoxes(preds);
            setAllowPredict(false);
        });
    }


    /*
     * drawBoxes:
     * 
     * @param preds: list of predictions
     * 
     * Draws bounding boxes over the canvas image.
     */
    const drawBoxes = (preds) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.strokeStyle = 'red';    // color of bounding boxes
        context.lineWidth = 3;          // line weight of bounding boxes
        context.font = '16px serif';    // font size and family
        context.fillStyle = 'red';

        console.log(preds);
        preds.forEach(pred => {
            const x = pred.bbox[0];
            const y = pred.bbox[1];
            const width = pred.bbox[2];
            const height = pred.bbox[3];

            context.strokeRect(x, y, width, height);
            context.fillText(pred.class, x, y - 10);
        })
    }


    /*********************************************************
     * React component return
     *********************************************************/
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
                                <span className='file-label'>
                                    Upload
                                </span>
                            </span>
                        </label>
                        {/* Predict Button */}
                        <button className='button is-success ml-2' disabled={!allowPredict} onClick={handlePredict}>
                            Predict
                        </button>
                        {/* Info Button -> Displays a bulma-modal element with info about the object detection algorithm. */}
                        <button className='button is-info ml-2' onClick={() => { setShowInfo(true) }}>Info</button>
                        <div className={`modal ${showInfo ? 'is-active' : ''}`}>
                            <div className="modal-background" onClick={() => { setShowInfo(false) }}></div>
                            <div className="modal-content">
                                {modelInfo}
                            </div>
                        </div>
                    </div>
                </div>

                {/* right column - lists labels and confidence scores found by model */}
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
                                <p>{pred['class']}: {pred['score']}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div >
    );
}

export default App;
