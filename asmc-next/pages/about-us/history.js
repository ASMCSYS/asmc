// import { Loader } from "@/components/common/Loader";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import Head from "next/head";
import { Footer } from "@/components/includes/Footer";
import { Banner } from "@/components/common/Banner";

export default function History() {
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
                {/* <Loader show={true} /> */}
                <Header />

                <Banner title={"ASMC History"} breadcrumbs={[{ title: "Home", link: "/" }, { title: "About Us", link: "/about-us/overview" }, { title: "History" }]} />

                <Footer />
            </main>
        </>
    );
}