// import { Loader } from "@/components/common/Loader";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import Head from "next/head";
import { Footer } from "@/components/includes/Footer";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { getAuthUser } from "@/utils/helper";
import { useSelector } from "react-redux";

export default function SignIn() {
    const { isAuth } = useSelector((state) => state.auth);

    useEffect(() => {
        if (getAuthUser()) {
            window.location.href = "/";
        }
    }, [])

    return (
        <>
            <Head>
                <title>Forgot Password | ASMC | Anushaktinagar Sports Management Committee</title>
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
                <Header isAuth={isAuth} />
                <ToastContainer />

                <section className="section section--space-bottom authentication authentication--alt wow fadeInUp" data-aos="fade-up" data-aos-delay="50">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8 col-xxl-6">
                                <div className="authentication__wrapper">
                                    <ForgotPasswordForm />
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