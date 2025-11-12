import Head from "next/head";
import { ValidateAuth } from '@/components/auth/ValidateAuth';
import { fetchAllActivity, fetchSingleActivity } from "@/apis/bookings.api";
import ActivityDetails from "@/container/ActivityDetails";
import { useFetchSingleActivityQuery } from "@/redux/masters/mastersApis";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ActivityPage = () => {
    const router = useRouter();
    const { data: activity } = useFetchSingleActivityQuery({ activity_id: router?.query?.activity_id }, { skip: !router.query.activity_id });

    return (
        <>
            <Head>
                <title>Sports Booking | Anushaktinagar Sports Management Committee</title>
                <meta name="description" content="Anushaktinagar Sports Management Committee" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <link rel="icon" href="/favicon.ico" />

                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            </Head>
            <main>
                <ValidateAuth redirect={false} />

                <ActivityDetails activity={activity} />
            </main>
        </>
    );
};

export default ActivityPage;