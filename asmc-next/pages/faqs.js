import Head from "next/head"
import { ValidateAuth } from "@/components/auth/ValidateAuth"
import { useRouter } from "next/router"
import FaqsContainer from "@/container/FaqsContainer"

const FaqsList = () => {
    const { query } = useRouter()

    return (
        <>
            <Head>
                <title>FAQs | Anushaktinagar Sports Management Committee</title>
                <meta
                    name="description"
                    content="Anushaktinagar Sports Management Committee"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <link rel="icon" href="/favicon.ico" />

                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
            </Head>
            <main>
                <ValidateAuth redirect={false} />
                <FaqsContainer type={query?.type} />
            </main>
        </>
    )
}

export default FaqsList
