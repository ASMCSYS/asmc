import { useState } from "react";
import Link from "next/link";

export const HallsCard = ({ data, facility }) => {
    const [isReadMore, setIsReadMore] = useState(true);

    const toggleReadMore = (e) => {
        e.preventDefault();
        setIsReadMore(!isReadMore);
    };

    const truncateText = (text, length) => {
        return text?.length > length ? text.substring(0, length) + "..." : text;
    };

    return (
        <div className="col-sm-10 col-md-6 col-lg-4 col-xxl-3 section__col">
            <div className="facility--main__card">
                <div className="facility--main__card-thumb">
                    <Link href={`/facilities/${facility}/${data?.hall_id}`}>
                        <img
                            src={data?.images?.[0]}
                            alt="Image"
                            onError={(e) => {
                                e.target.src = "https://ik.imagekit.io/hl37bqgg7/908513-1712119993746_LlxYgPGS6.jpeg"; // Fallback image
                            }}
                        />
                    </Link>
                </div>
                <div className="facility--main__card-content">
                    <h5>
                        <Link href={`/facilities/${facility}/${data?.hall_id}`}>{data?.name}</Link>
                    </h5>
                    <p className="secondary-text">
                        {isReadMore ? truncateText(data?.description, 150) : data?.description}
                        <a href="/" className="read-more" onClick={(e) => toggleReadMore(e)}>
                            {isReadMore ? " Read More" : " Show Less"}
                        </a>
                    </p>
                    <Link
                        href={`/facilities/${facility}/${data?.hall_id}`}
                        className="facility--main__card-content__cta"
                    >
                        View more <i className="asmc-long-right-arrow"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};
