// import { Loader } from "@/components/common/Loader";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import Head from "next/head";
import { Footer } from "@/components/includes/Footer";
import { Banner } from "@/components/common/Banner";
import { useGetAboutPageCmsQuery } from "@/redux/common/commonApis";

export default function History() {
    const { data } = useGetAboutPageCmsQuery();
    return (
        <>
            <Head>
                <title>ASMC History | Anushaktinagar Sports Management Committee</title>
                <meta name="description" content="Anushaktinagar Sports Management Committee" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <link rel="icon" href="/favicon.ico" />

                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            </Head>
            <main>
                <ScrollProgressBar />
                <Header />

                <Banner
                    title={"Fees Structure"}
                    breadcrumbs={[
                        { title: "Home", link: "/" },
                        { title: "About Us", link: "/about-us/overview" },
                        { title: "Fees Structure" },
                    ]}
                />

                <section className="section about about--fees" data-aos="fade-up" data-aos-delay="50">
                    <div className="container">
                        <div className="row section__row align-items-center">
                            <div className="col-lg-12 col-xl-12 section__col">
                                <div
                                    className="section__content"
                                    dangerouslySetInnerHTML={{ __html: data?.json?.fees_content }}
                                >
                                    {/* <h5 className="section__content-sub-title">
                                        Membership Charges and Sports Fees Structure
                                    </h5> */}
                                </div>
                                {/* <p className="section__content-text mb-2">
                                    Click below download button to view the list of membership charges and sports fees
                                    structure.
                                </p> */}
                                <a href={data?.json?.fees_structure_url} target="_blank" className="cmn-button">
                                    Download
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}
