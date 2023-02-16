import { useState } from 'react';
import axios from 'axios';
import './styles/mystyles.css';
import carImg from './img/img51.jpg';

const App = () => {
    const [preds, setPreds] = useState('none');

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
                        <img src={carImg}></img>
                    </figure>
                    <button className='button is-warning mr-3'>Upload</button>
                    <button className='button is-link'
                        onClick={queryDetectApi}>
                        Predict
                    </button>
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
