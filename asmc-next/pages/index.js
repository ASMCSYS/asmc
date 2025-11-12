import Head from "next/head";
import HomePageContainer from "@/container/HomePage";
import { ValidateAuth } from "@/components/auth/ValidateAuth";

export default function Home() {
    return (
        <>
            <Head>
                {/* Generate meta keywords for this page */}
                <title>Home | Anushaktinagar Sports Management Committee</title>
                <meta name="description" content="Anushaktinagar Sports Management Committee" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <link rel="icon" href="/favicon.ico" />

                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            </Head>
            <main>
                <ValidateAuth redirect={false} />
                <HomePageContainer />
            </main>
        </>
    );
}
