import {FC, useEffect, useState} from 'react';
import {BsChevronLeft, BsChevronRight} from 'react-icons/bs';

interface PaginatorProps {
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    paginationSize?: number;
}

const Paginator: FC<PaginatorProps> = ({page, setPage, totalPages, paginationSize = 5}) => {
    const [currentPage, setCurrentPage] = useState(page);

    useEffect(() => {
        setPage(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        if ((currentPage === totalPages && page === currentPage + 1) || (currentPage === 1 && page === currentPage - 1)) {
            return;
        }
        if (page < 1) {
            setCurrentPage(1);
        } else if (page > totalPages) {
            setCurrentPage(totalPages);
        } else {
            setCurrentPage(page);
        }
    };

     const renderPaginationButtons = () => {
        const buttons = [];

        const currentBlock = Math.ceil(currentPage / paginationSize);

        const startPage = (currentBlock - 1) * paginationSize + 1;
        const endPage = Math.min(startPage + paginationSize - 1, totalPages);

        for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
            buttons.push(
                <div key={pageNumber} className='px-2'>
                    <button
                        className={`px-4 py-2 rounded-full ${
                            pageNumber === currentPage ? 'bg-primary text-white' : 'bg-gray-200'
                        } font-mono`}
                        onClick={() => handlePageChange(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                </div>
            );
        }

        return buttons;
    };

    return (
        <div className='flex flex-row items-center justify-center py-6'>
            <button
                className='p-4 rounded-full bg-white font-mono'
                onClick={() => handlePageChange(currentPage - 1)}
            >
                <BsChevronLeft/>
            </button>
            {renderPaginationButtons()}
            <button
                className='p-4 rounded-full bg-white font-mono'
                onClick={() => handlePageChange(currentPage + 1)}
            >
                <BsChevronRight/>
            </button>
        </div>
    );
}

export default Paginator;
