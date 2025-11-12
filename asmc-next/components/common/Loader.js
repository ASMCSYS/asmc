export const Loader = ({ show = true }) => {
    return (
        <div id="preloader" className={`preloader ${show ? '' : 'loaded'}`}>
            <div className="animation-preloader">
                <div className="spinner"></div>
                <p className="text-center mt-3">Loading</p>
            </div>
            <div className="loader">
                <div className="row">
                    <div className="col-3 loader-section section-left">
                        <div className="bg"></div>
                    </div>
                    <div className="col-3 loader-section section-left">
                        <div className="bg"></div>
                    </div>
                    <div className="col-3 loader-section section-right">
                        <div className="bg"></div>
                    </div>
                    <div className="col-3 loader-section section-right">
                        <div className="bg"></div>
                    </div>
                </div>
            </div>
        </div>

    )
}