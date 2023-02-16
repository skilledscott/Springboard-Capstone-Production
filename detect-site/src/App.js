import { useState } from 'react';
import axios from 'axios';

import './styles/mystyles.css';
import carImg from './img/img51.jpg';

const App = () => {
    const [preds, setPreds] = useState('none');
    const [image, setImage] = useState(null);

    /* Using axios, get a response from the detect-api setup in Flask */
    const queryDetectApi = () => {
        const path = 'detect-api';
        axios.get(path).then((response) => {
            console.log(response);
            setPreds('Got response! Check console.');
        }).catch((error) => {
            console.log(error);
        });
    }

    const uploadFile = (e) => {
        setImage(URL.createObjectURL(e.target.files[0]));
    }

    return (
        <div>
            {/* Hero component */}
            <div className="hero is-primary">
                <div className="hero-body">
                    <p className="title">
                        Object Detection Capstone Project
                    </p>
                    <p className="subtitle">
                        Created by Scott Gibson
                    </p>
                </div>
            </div>

            {/* left column: image, right column: api output */}
            <div className='columns is-mobile mt-4'>
                {/* left column */}
                <div className='column'>
                    <figure className='image block user-image'>
                        <img src={image ? image : carImg}></img>
                    </figure>

                    {<div className='file is-warning'>
                        <label className='file-label'>
                            <input className="file-input" type="file"
                                onChange={uploadFile} />
                            <span className='file-cta'>
                                Upload
                            </span>
                        </label>
                        <button className='button is-link ml-2'
                            onClick={queryDetectApi}>
                            Predict
                        </button>
                    </div>}
                </div>

                {/* right column */}
                <div className='column'>
                    <p className='title'>api response column</p>
                    <p className='is-size-4'>{preds}</p>
                </div>
            </div>
        </div >
    );
}

export default App;
