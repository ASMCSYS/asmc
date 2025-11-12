import { faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';

const ScrollProgressBar = () => {
    const [pathLength, setPathLength] = useState(0);

    const svgStyle = {
        transition: 'stroke-dashoffset 10ms linear 0s',
        strokeDasharray: '307.919 307.919',
        strokeDashoffset: '268.816'
    };

    useEffect(() => {
        const progressPath = document.querySelector(".progress-wrap .progress-circle path");
        const height = document.documentElement.scrollHeight - window.innerHeight;

        progressPath.style.transition = progressPath.style.WebkitTransition = "none";
        const length = progressPath.getTotalLength();
        progressPath.style.strokeDasharray = length + " " + length;
        progressPath.style.strokeDashoffset = length;
        progressPath.getBoundingClientRect();
        progressPath.style.transition = progressPath.style.WebkitTransition =
            "stroke-dashoffset 10ms linear";

        setPathLength(length);

        const updateProgress = () => {
            const scroll = window.scrollY;
            const progress = length - (scroll * length) / height;
            progressPath.style.strokeDashoffset = progress;
        };

        updateProgress();
        window.addEventListener('scroll', updateProgress);

        return () => {
            window.removeEventListener('scroll', updateProgress);
        };
    }, []);

    const offset = 50;
    const duration = 550;

    const handleScroll = () => {
        if (window.scrollY > offset) {
            document.querySelector(".progress-wrap")?.classList.add("active-progress");
        } else {
            document.querySelector(".progress-wrap")?.classList.remove("active-progress");
        }
    };

    const handleProgressBarClick = (event) => {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="progress-wrap" onClick={handleProgressBarClick}>
            <FontAwesomeIcon icon={faAngleDoubleUp} className='progress-wrap-first' />
            <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
                <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" style={svgStyle}></path>
            </svg>
        </div>
    );
};

export default ScrollProgressBar;
