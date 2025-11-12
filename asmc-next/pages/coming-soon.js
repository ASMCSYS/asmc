// import { Loader } from "@/components/common/Loader";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import Head from "next/head";
import { Footer } from "@/components/includes/Footer";
import Link from "next/link";

export default function ComingSoon() {
    return (
        <>
            <Head>
                <title>Coming Soon | ASMC | Anushaktinagar Sports Management Committee</title>
                <meta name="description" content="Anushaktinagar Sports Management Committee" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <link rel="icon" href="/favicon.ico" />

                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            </Head>
            <main>
                <ScrollProgressBar />
                {/* <Loader show={true} /> */}
                <Header />

                <section className="section error" data-aos="fade-up" data-aos-delay="50">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-6">
                                <div className="error__inner-content text-center">
                                    <h2>Under Consutration</h2>
                                    <p>We are working on this page, soon this will be available.</p>
                                    <div className="section__cta">
                                        <Link href="/" className="cmn-button">Back to home</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}