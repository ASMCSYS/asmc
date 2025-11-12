import Head from "next/head";
import { ValidateAuth } from "@/components/auth/ValidateAuth";
import HallBookingDetails from "@/container/HallBookingDetails";
import { useFetchSingleHallQuery } from "@/redux/masters/mastersApis";
import { useRouter } from "next/router";

const ActivityPage = () => {
    const router = useRouter();
    const { data: halls } = useFetchSingleHallQuery(
        { hall_id: router?.query?.hall_id },
        { skip: !router.query.hall_id }
    );

    return (
        <>
            <Head>
                <title>{halls?.name} Booking | Anushaktinagar Sports Management Committee</title>
                <meta name="description" content="Anushaktinagar Sports Management Committee" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <link rel="icon" href="/favicon.ico" />

                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            </Head>
            <main>
                <ValidateAuth redirect={false} />

                <HallBookingDetails halls={halls} />
            </main>
        </>
    );
};

export default ActivityPage;
