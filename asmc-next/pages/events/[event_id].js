import Head from "next/head";
import { ValidateAuth } from "@/components/auth/ValidateAuth";
import { useRouter } from "next/router";
import { useFetchSingleEventQuery } from "@/redux/masters/mastersApis";
import EventDetails from "@/container/EventDetails";
import { useEffect } from "react";
import { Loader } from "@/components/common/Loader";

const EventDetailPage = () => {
    const router = useRouter();
    const { data: event, isLoading } = useFetchSingleEventQuery(
        { event_id: router?.query?.event_id },
        { skip: !router.query.event_id }
    );

    console.log(isLoading, "isLoading");

    return (
        <>
            <Head>
                <title>Events | Anushaktinagar Sports Management Committee</title>
                <meta name="description" content="Anushaktinagar Sports Management Committee" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <link rel="icon" href="/favicon.ico" />

                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            </Head>
            <main>
                <ValidateAuth redirect={false} />
                {isLoading ? <Loader show={true} /> : <EventDetails event={event} />}
            </main>
        </>
    );
};

export default EventDetailPage;
