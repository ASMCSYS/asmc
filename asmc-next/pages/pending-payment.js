import { ValidateAuth } from "@/components/auth/ValidateAuth";
import PendingPaymentContainer from "@/container/PendingPayment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function PendingPayment() {
    const { query } = useRouter();

    useEffect(() => {
        if (query && query.status === "Failure") {
            alert("Your payment for order id " + query.order_id + " has been failed. Please try again later.");
            window.location.href = "/pending-payment";
        }
    }, [query]);

    return (
        <>
            <Head>
                <title>Sports Activity Details | Anushaktinagar Sports Management Committee</title>
                <meta name="description" content="Anushaktinagar Sports Management Committee" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <link rel="icon" href="/favicon.ico" />

                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            </Head>
            <main>
                <ValidateAuth redirect={true} />
                <PendingPaymentContainer />
            </main>
        </>
    );
}
