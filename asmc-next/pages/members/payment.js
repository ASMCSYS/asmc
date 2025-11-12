import { fetchSingleMember } from "@/apis/members.api";
import { Banner } from "@/components/common/Banner";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Footer } from "@/components/includes/Footer";
import { Header } from "@/components/includes/Header";
import { MemberData } from "@/components/payment/MemberData";
import Head from "next/head";

export default function Payment({ memberData }) {
    return (
        <>
            <Head>
                <title>ASMC | Anushaktinagar Sports Management Committee</title>
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

                <Banner title={"Payment"} breadcrumbs={[{ title: "Home", link: "/" }, { title: "Members", link: "/" }, { title: "Payment" }]} />

                {
                    memberData && memberData.success && memberData.result
                        ?
                        <MemberData data={memberData.result} />
                        :
                        null
                }

                <Footer />
            </main>
        </>
    );
}

export async function getServerSideProps(props) {
    try {
        const id = props.query.member_id;
        if (!id) {
            throw new Error();
        }
        const response = await fetchSingleMember(id);
        return {
            props: {
                memberData: response,
            },
        };
    } catch (error) {
        return {
            props: {
                memberData: {
                    success: false,
                    message: "Something went wrong",
                    result: {},
                }
            },
        };
    }
}
