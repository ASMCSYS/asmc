import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "odometer/themes/odometer-theme-default.css";
import Link from "next/link";
import { useGetHomePageCmsQuery } from "@/redux/common/commonApis";

let loadedCallback = null;
let loaded = false;

const Odometer = dynamic(
    async () => {
        const mod = await import("react-odometerjs");
        loaded = true;
        if (loadedCallback != null) {
            loadedCallback();
        }
        return mod;
    },
    {
        ssr: false,
        loading: () => 0,
    }
);

export const HomeAboutUs = () => {
    const [odometerLoaded, setOdometerLoaded] = useState(loaded);
    const [odometerValue, setOdometerValue] = useState(0);

    const { data } = useGetHomePageCmsQuery();

    loadedCallback = () => {
        setOdometerLoaded(true);
    };

    useEffect(() => {
        if (odometerLoaded) {
            setOdometerValue(30);
        }
    }, [odometerLoaded]);

    return (
        <section className="section about--secondary" data-aos="fade-up" data-aos-delay="50">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-5 col-xxl-5 d-none d-lg-block">
                        <div className="about--secondary__thumb dir-rtl">
                            <img src={data?.json?.home_square_image} alt="Image" className="unset" />
                            <div className="about--secondary__modal">
                                <img src={data?.json?.home_round_image} alt="img" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7 col-xxl-6 offset-xxl-1">
                        <div className="section__content">
                            <h5 className="section__contenVt-sub-title">{data?.json?.title}</h5>
                            <h2 className="section__content-title">{data?.json?.subtitle}</h2>
                            <p
                                className="section__content-text"
                                dangerouslySetInnerHTML={{ __html: data?.json?.text_content }}
                            ></p>
                            <div className="section__content-cta">
                                <Link href={"/about-us/overview"} className="cmn-button">
                                    Read More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
