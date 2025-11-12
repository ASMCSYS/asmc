import dynamic from 'next/dynamic'
import "odometer/themes/odometer-theme-default.css";
import { useEffect, useState } from 'react';

let loadedCallback = null;
let loaded = false;

const Odometer = dynamic(async () => {
    const mod = await import("react-odometerjs");
    loaded = true;
    if (loadedCallback != null) {
        loadedCallback();
    }
    return mod;
}, {
    ssr: false,
    loading: () => 0
});


export const AboutCounter = () => {
    const [odometerLoaded, setOdometerLoaded] = useState(loaded);
    const [odometerValue, setOdometerValue] = useState([0, 0, 0, 0]);

    loadedCallback = () => {
        setOdometerLoaded(true);
    };

    useEffect(() => {
        if (odometerLoaded) {
            setOdometerValue([850, 70, 50, 60]);
        }
    }, [odometerLoaded]);

    return (
        <section className="section counter">
            <div className="container">
                <div className="row section__row">
                    <div className="col-sm-6 col-lg-3 section__col">
                        <div className="counter__card">
                            <div className="counter__card-thumb">
                                <i className="asmc-users"></i>
                            </div>
                            <div className="counter__card-content">
                                <h2>
                                    <Odometer format="d" duration={8000} value={odometerValue[0]} />
                                    <span>+</span>
                                </h2>
                                <p className="primary-text">Active Member</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-lg-3 section__col">
                        <div className="counter__card">
                            <div className="counter__card-thumb">
                                <i className="asmc-shot-ground"></i>
                            </div>
                            <div className="counter__card-content">
                                <h2>
                                    <Odometer format="d" duration={8000} value={odometerValue[1]} />
                                    <span>+</span>
                                </h2>
                                <p className="primary-text">Professional Trainer</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-lg-3 section__col">
                        <div className="counter__card">
                            <div className="counter__card-thumb">
                                <i className="asmc-trophy"></i>
                            </div>
                            <div className="counter__card-content">
                                <h2>
                                    <Odometer format="d" duration={8000} value={odometerValue[3]} />
                                    <span>+</span>
                                </h2>
                                <p className="primary-text">Award Winning</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-lg-3 section__col">
                        <div className="counter__card">
                            <div className="counter__card-thumb">
                                <i className="asmc-user-shield"></i>
                            </div>
                            <div className="counter__card-content">
                                <h2>
                                    <Odometer format="d" duration={8000} value={odometerValue[4]} />
                                    <span>+</span>
                                </h2>
                                <p className="primary-text">Available Field</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}