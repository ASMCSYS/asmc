import Link from "next/link"

export const ImportantNote = ({ title, description }) => {
    return (
        <section className="section error" data-aos="fade-up" data-aos-delay="50">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="error__inner-content text-center">
                            <h2>{title}</h2>
                            <p>{description}</p>
                            <div className="section__cta">
                                <Link href="/" className="cmn-button">Back to home</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}