export const VideoBanner = () => {
    return (
        <div className="banner--slider">
            <div className="banner--secondary slide__text">
                <video autoPlay loop muted id="bgvid" className="img-fluid">
                    <source src="/images/bg-vid.mp4" type="video/mp4" />
                </video>
            </div>
        </div>
    )
}