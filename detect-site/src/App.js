import './styles/mystyles.css';

function App() {
    return (
        <div>
            {/* Hero component */}
            <div className="hero is-primary">
                <div class="hero-body">
                    <p class="title">
                        Object Detection Capstone Project
                    </p>
                    <p class="subtitle">
                        Created by Scott Gibson
                    </p>
                </div>
            </div>

            {/* left column: image, right column: api output */}
            <div className='columns is-mobile'>
                {/* left column */}
                <div className='column'>
                    <p className='title'>image column</p>
                    <button className='button is-link'>Predict</button>
                </div>

                {/* right column */}
                <div className='column'>
                    <p className='title'>api response column</p>
                </div>
            </div>
        </div>
    );
}

export default App;
