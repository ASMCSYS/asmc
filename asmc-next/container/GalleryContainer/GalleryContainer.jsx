import React, { Fragment, useEffect, useState } from "react";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import { Footer } from "@/components/includes/Footer";
import { Banner } from "@/components/common/Banner";
import { fetchEvents } from "@/apis/events.api";
import { toast_popup } from "@/utils/toast";
import { format } from "date-fns";
import Link from "next/link";
import { useFetchBannerQuery, useFetchGalleryCategoryQuery, useFetchGalleryQuery } from "@/redux/masters/mastersApis";
import { Loader } from "@/components/common/Loader";
import Pagination from "@/components/common/Pagination";
import { ImageLightBox } from "@/components/common/ImageLightBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";

const GalleryContainer = (props) => {
    const { data: bannerData } = useFetchBannerQuery({ sortBy: 1, sortField: "createdAt", type: "photo_gallery" });

    const [show, setShow] = useState(false);
    const [currentIndex, setIndex] = useState(0);
    const [pageNo, setPageNo] = useState(0);

    const [images, setImages] = useState([]);
    const [currentCategory, setCurrentCategory] = useState("");

    const handleTabClick = (e, val) => {
        e.preventDefault();
        setCurrentCategory(val);
    };

    const handlePagination = (newPage) => {
        if (newPage === "next") {
            setPageNo((prev) => prev + 1);
        } else if (newPage === "prev") {
            setPageNo((prev) => prev - 1);
        } else {
            setPageNo(newPage);
        }
    };

    const {
        isLoading,
        isFetching,
        data: gallery,
    } = useFetchGalleryQuery({
        pageNo,
        limit: 12,
        sortBy: -1,
        sortField: "createdAt",
        // category: currentCategory,
        type: props.type === "photos" ? "image" : props.type === "videos" ? "video" : null,
    });

    const [galleryContent, setGalleryContent] = useState([]);
    const [driveLinks, setDriveLinks] = useState([]);

    useEffect(() => {
        if (gallery && gallery.result) {
            if (gallery.result.length > 0) {
                const content = gallery.result.filter((item) => !item.title);
                const drive = gallery.result.filter((item) => item.type === "image" && item.title);

                setGalleryContent(content);
                setDriveLinks(drive);
            }
        }
    }, [gallery]);

    useEffect(() => {
        if (gallery && gallery.result) setImages(gallery.result);
    }, [gallery]);

    // const { data: galleryCategory } = useFetchGalleryCategoryQuery({ type: props.type === "photos" ? "image" : props.type === "videos" ? "video" : null });

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Fragment>
            <ScrollProgressBar />
            <Header isAuth={props.isAuth} />

            <Banner
                title={props.type === "photos" ? "Photo Gallery" : "Video Gallery"}
                breadcrumbs={[
                    { title: "Home", link: "/" },
                    { title: props.type === "photos" ? "Photo Gallery" : "Video Gallery" },
                ]}
                image={bannerData?.url}
            />

            <section class="section facility--main" data-aos="fade-up" data-aos-delay="50">
                <div class="container">
                    {isLoading || isFetching ? (
                        <Loader show={true} inside={true} />
                    ) : galleryContent.length > 0 ? (
                        <>
                            <div class="row section__row justify-content-center">
                                {driveLinks.length > 0 && (
                                    <div className="col-12 mb-4">
                                        <h2 className="mb-3 fw-semibold">Drive Links</h2>
                                        <div className="row g-3">
                                            {driveLinks.map((item, index) => (
                                                <div className="col-sm-6 col-lg-4 col-xl-3" key={index}>
                                                    <a
                                                        href={item?.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-decoration-none"
                                                    >
                                                        <div className="card h-100 shadow-sm border-0 hover-shadow">
                                                            <div className="card-body p-0 d-flex align-items-center gap-3">
                                                                <FontAwesomeIcon
                                                                    icon={faFileAlt}
                                                                    size="lg"
                                                                    className="text-primary"
                                                                />
                                                                <span className="fw-medium text-dark text-truncate">
                                                                    {item?.title}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {galleryContent?.length > 0 ? (
                                    galleryContent?.map((item, key) => {
                                        return (
                                            <div
                                                className="col-sm-10 col-md-6 col-lg-4 col-xxl-3 section__col"
                                                key={key}
                                            >
                                                <div
                                                    className="facility--main__card"
                                                    style={{ padding: 0, height: "100%" }}
                                                >
                                                    <div
                                                        className="facility--main__card-thumb"
                                                        style={{ height: "100%" }}
                                                    >
                                                        <Link
                                                            href={`/`}
                                                            onClick={(e) => [
                                                                e.preventDefault(),
                                                                setIndex(key),
                                                                setShow(true),
                                                            ]}
                                                        >
                                                            <img
                                                                src={
                                                                    item?.type === "video"
                                                                        ? item?.video_thumbnail
                                                                        : item?.url
                                                                }
                                                                alt="Image"
                                                                onError={(e) => {
                                                                    e.target.src = "/assets/images/no-image.png"; // Fallback image
                                                                }}
                                                            />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center">
                                        <h2>
                                            {props.type === "videos" ? "No Videos Available" : "No Photos Available"}
                                        </h2>
                                    </div>
                                )}
                            </div>
                            {images.length > 0 ? (
                                <div className="row">
                                    <div className="col-12 justify-content-center section__cta">
                                        <Pagination
                                            onPageChange={handlePagination}
                                            totalCount={gallery.count}
                                            limit={gallery.limit}
                                            page={pageNo}
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <p className="text-center">We haven't added anything here yet. please check back later.</p>
                    )}
                </div>
            </section>

            {gallery?.limit && images.length > 0 ? (
                <ImageLightBox show={show} setShow={() => setShow(false)} images={images} index={currentIndex} />
            ) : null}

            <Footer />
        </Fragment>
    );
};

export default GalleryContainer;
