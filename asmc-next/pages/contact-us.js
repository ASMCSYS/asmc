import Head from "next/head";
import ScrollProgressBar from '@/components/common/ScrollProgressBar';
import { ValidateAuth } from '@/components/auth/ValidateAuth';
import ContactUsContainer from '@/container/ContactUs';

const ContactUs = () => {



    return (
        <>
            <Head>
                <title>Sign In | ASMC | Anushaktinagar Sports Management Committee</title>
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

                <ContactUsContainer />
            </main>
        </>
    );
};

export default ContactUs;
