export const MainBanner = ({ bannerData }) => {
    return (
        <section class="banner--secondary banner--main" style={{
            backgroundImage: `url(${bannerData?.url})`,
            // backgroundImage: `linear-gradient(110deg, #fdfffa 8%, rgba(255, 255, 255, 0) 100%), url(${bannerData?.url})`,
        }}>
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="banner__content text-center" data-aos="fade-up" data-aos-delay="50">
                            {/* <h4 class="banner__content-sub-title">Welcome to</h4>
                            <h1 class="banner__content-title">Anushaktinagar Sports Facilities</h1>
                            <h4 class="banner__content-text">managed by ASMC</h4> */}
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}