// import { Loader } from "@/components/common/Loader";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import Head from "next/head";
import { Footer } from "@/components/includes/Footer";
import { Banner } from "@/components/common/Banner";
import { AboutUs } from "@/components/about/AboutUs";
import { AboutUsTestimonial } from "@/components/about/AboutUsTestimonial";
import { AboutCounter } from "@/components/about/AboutCounter";
import { ClientsList } from "@/components/common/ClientsList";
import { useFetchBannerQuery } from "@/redux/masters/mastersApis";
import { useSelector } from "react-redux";
import { ValidateAuth } from "@/components/auth/ValidateAuth";

export default function Overview() {
  // fetch isAuth from state of redux
  const { isAuth } = useSelector((state) => state.auth);
  const { data: bannerData } = useFetchBannerQuery({ sortBy: 1, sortField: "createdAt", type: "about_us" });

  return (
    <>
      <Head>
        <title>About ASMC | Anushaktinagar Sports Management Committee</title>
        <meta name="description" content="Anushaktinagar Sports Management Committee" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="/favicon.ico" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </Head>
      <main>
        <ScrollProgressBar />
        <ValidateAuth redirect={false} />
        {/* <Loader show={true} /> */}
        <Header isAuth={isAuth} />

        <Banner
          title={"About us"}
          breadcrumbs={[{ title: "Home", link: "/" }, { title: "About Us", link: "/about-us/overview" }, { title: "Overview" }]}
          image={bannerData?.url}
        />

        <AboutUs />

        {/* <AboutCounter /> */}

        {/* <AboutUsTestimonial /> */}

        {/* <ClientsList /> */}

        <Footer />
      </main>
    </>
  );
}