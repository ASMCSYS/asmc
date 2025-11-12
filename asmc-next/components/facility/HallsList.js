import { useFetchHallsListQuery } from "@/redux/masters/mastersApis";
import { useEffect, useState } from "react";
import Pagination from "@/components/common/Pagination";
import { HallsCard } from "@/components/facility/HallsCard";
import { InputBox } from "@/components/common/InputBox";

export const HallsList = ({ currentFacility }) => {
    const [pagination, setPagination] = useState({
        pageNo: 0,
        limit: 8,
        sortBy: 1,
        sortField: "name",
        keywords: "",
    });
    const [count, setCount] = useState(0);

    const {
        data: halls,
        isLoading: isAllsLoading,
        isFetching,
    } = useFetchHallsListQuery({ ...pagination }, { skip: !currentFacility?.permalink });

    useEffect(() => {
        setCount(halls?.count);
    }, [halls]);

    const handlePageChange = (page) => {
        setPagination({ ...pagination, pageNo: page });
    };

    return (
        <section className="section facility--main" data-aos="fade-up" data-aos-delay="400">
            <div className="container">
                <div className="row">
                    <div className="col-12 d-flex justify-content-end section__header">
                        <InputBox
                            placeholder="Search Halls"
                            type="search"
                            onChange={(e) => setPagination({ ...pagination, keywords: e.target.value })}
                        />
                    </div>
                </div>
                <div className="row section__row justify-content-center relative">
                    {isAllsLoading || isFetching ? (
                        <h6 className="text-center">Loading...</h6>
                    ) : halls?.result && halls?.result.length > 0 ? (
                        halls?.result.map((halls, index) => (
                            <HallsCard data={halls} key={index} facility={currentFacility?.permalink} />
                        ))
                    ) : (
                        <p>No halls found for booking</p>
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
