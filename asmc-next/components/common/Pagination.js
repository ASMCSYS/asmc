import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

const Pagination = ({ onPageChange, totalCount, limit, page }) => {
    const [currentPage, setCurrentPage] = useState(page || 0);

    const totalPages = Math.ceil(totalCount / limit) || 0;

    const handleClick = (page) => {
        if (page >= 0 && page <= totalPages) {
            setCurrentPage(page);
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];

        for (let i = 0; i < totalPages; i++) {
            pageNumbers.push(
                <li key={i} className={i === currentPage ? 'active' : ''}>
                    <button onClick={() => handleClick(i)}>{i + 1}</button>
                </li>
            );
        }

        return pageNumbers;
    };

    return (
        <ul className="pagination">
            <li>
                <button onClick={() => handleClick(currentPage - 1)} disabled={(currentPage) === 0}>
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>
            </li>
            {renderPageNumbers()}
            <li>
                <button onClick={() => handleClick(currentPage + 1)} disabled={(currentPage + 1) === totalPages}>
                    <FontAwesomeIcon icon={faAngleRight} />
                </button>
            </li>
        </ul>
    );
};

export default Pagination;
