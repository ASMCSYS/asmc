import React, { Fragment, useMemo, useState } from "react";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import { Footer } from "@/components/includes/Footer";
import { Banner } from "@/components/common/Banner";
import { useFetchBannerQuery, useFetchNoticesQuery } from "@/redux/masters/mastersApis";
import { Loader } from "@/components/common/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faPaperclip } from "@fortawesome/free-solid-svg-icons";

const NoticesContainer = (props) => {
    const { data: bannerData, isLoading } = useFetchBannerQuery({
        sortBy: 1,
        sortField: "createdAt",
        type: "common",
    });

    const { data: noticeData } = useFetchNoticesQuery({
        sortBy: 1,
        sortField: "createdAt",
        limit: 1000,
        type: "public",
    });

    const sortedData = useMemo(() => {
        if (!noticeData?.result) return [];
        return noticeData.result
            .filter((notice) => notice.status !== false) // remove inactive notices
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [noticeData]);

    const [activeAccordion, setActiveAccordion] = useState(0);

    const handleAccordionClick = (index) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    const handleDownload = async (e, pdf_url, title) => {
        e.preventDefault();
        const response = await fetch(pdf_url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = title || "file.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (isLoading) return <Loader />;

    return (
        <Fragment>
            <ScrollProgressBar />
            <Header isAuth={props.isAuth} />

            <Banner
                title={"Notices"}
                breadcrumbs={[{ title: "Home", link: "/" }, { title: "Notices" }]}
                image={bannerData?.url}
            />

            <section className="faq section py-5">
                <div className="container">
                    <h2 className="mb-4 text-center">Latest Notices</h2>
                    <div className="accordion" id="noticeAccordion">
                        {sortedData?.map((notice, index) => {
                            if (notice.status === false) return;

                            return (
                                <div className="accordion-item mb-3 border rounded" key={notice._id}>
                                    <h2 className="accordion-header">
                                        <button
                                            className={`accordion-button ${activeAccordion === index ? "" : "collapsed"}`}
                                            type="button"
                                            onClick={() => handleAccordionClick(index)}
                                        >
                                            {notice.title}
                                        </button>
                                    </h2>
                                    <div
                                        className={`accordion-collapse collapse ${activeAccordion === index ? "show" : ""}`}
                                    >
                                        <div className="accordion-body">
                                            <div dangerouslySetInnerHTML={{ __html: notice.content }} />

                                            {notice.pdf_url && (
                                                <Fragment>
                                                    <div className="mt-3 d-flex align-items-center small text-muted">
                                                        <FontAwesomeIcon
                                                            icon={faPaperclip}
                                                            className="me-2 text-secondary"
                                                        />
                                                        <a
                                                            href={notice.pdf_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-decoration-underline text-dark"
                                                        >
                                                            Read More
                                                        </a>
                                                    </div>
                                                    <div className="mt-3 d-flex align-items-center small text-muted">
                                                        <FontAwesomeIcon
                                                            icon={faDownload}
                                                            className="me-2 text-secondary"
                                                        />
                                                        <a
                                                            href={notice.pdf_url}
                                                            onClick={(e) =>
                                                                handleDownload(e, notice.pdf_url, notice.title)
                                                            }
                                                            className="text-decoration-underline text-dark"
                                                        >
                                                            Download
                                                        </a>
                                                    </div>
                                                </Fragment>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <Footer />
        </Fragment>
    );
};

export default NoticesContainer;
