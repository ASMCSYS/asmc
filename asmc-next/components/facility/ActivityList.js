import { useFetchActivityListQuery } from "@/redux/masters/mastersApis";
import { useEffect, useState } from "react";
import Pagination from "@/components/common/Pagination";
import { ActivityCard } from "@/components/facility/ActivityCard";
import { InputBox } from "@/components/common/InputBox";

export const ActivityList = ({ currentFacility }) => {
    const [pagination, setPagination] = useState({
        pageNo: 0,
        limit: 8,
        sortBy: 1,
        sortField: "name",
        keywords: "",
    });
    const [count, setCount] = useState(0);

    const {
        data: activity,
        isLoading: isActivityLoading,
        isFetching,
    } = useFetchActivityListQuery(
        { ...pagination, facility_id: currentFacility?._id, show_hide: true },
        { skip: !currentFacility?.permalink }
    );

    useEffect(() => {
        setCount(activity?.count);
    }, [activity]);

    const handlePageChange = (page) => {
        setPagination({ ...pagination, pageNo: page }); // Adjusting pageNo as per zero-based index
        // Fetch data based on the new page
        // You can make an API call here passing the new page number
    };

    return (
        <section className="section facility--main" data-aos="fade-up" data-aos-delay="400">
            <div className="container">
                <div className="row">
                    <div className="col-12 d-flex justify-content-end section__header">
                        <InputBox
                            placeholder="Search activities"
                            type="search"
                            onChange={(e) => setPagination({ ...pagination, keywords: e.target.value })}
                        />
                    </div>
                </div>
                <div className="row section__row justify-content-center relative">
                    {isActivityLoading || isFetching ? (
                        <h6 className="text-center">Loading...</h6>
                    ) : activity?.result && activity?.result.length > 0 ? (
                        activity?.result.map((activity, index) => (
                            <ActivityCard data={activity} key={index} facility={currentFacility?.permalink} />
                        ))
                    ) : (
                        <p>No activities found</p>
                    )}
                </div>
                {count && (
                    <div className="row">
                        <div className="col-12 justify-content-center section__cta">
                            <Pagination onPageChange={handlePageChange} totalCount={count} limit={pagination.limit} />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
