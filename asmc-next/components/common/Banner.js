import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

export const Banner = ({ title, breadcrumbs, image = "/images/banner/Banner-2.png" }) => {

    return (
        <section className="banner--inner" style={{ backgroundImage: `url(${image})` }}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <div className="banner--inner__content">
                            <h2>{title}</h2>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="banner--inner__breadcrumb d-flex justify-content-start justify-content-md-end">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    {
                                        breadcrumbs.map((obj, key) => {
                                            return (
                                                <li className={`breadcrumb-item ${breadcrumbs.length === (key + 1) && 'active'}`} key={key}>
                                                    {
                                                        key !== 0 && <FontAwesomeIcon icon={faAngleRight} />
                                                    }
                                                    {
                                                        breadcrumbs.length === (key + 1) ? obj.title : <Link href={obj.link}>{obj.title}</Link>
                                                    }
                                                </li>
                                            )
                                        })
                                    }
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}