'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import "./pagination-component.css";

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
}

export default function PaginationComponent({ totalItems, itemsPerPage }: PaginationProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const rawPage = +(searchParams.get('page') || '1');
    const page = Math.min(Math.max(rawPage, 1), totalPages || 1);

    const handlePageClick = (num: number) => {
        if (num >= 1 && num <= totalPages && num !== page) {
            const params = new URLSearchParams(window.location.search);
            params.set('page', num.toString());
            router.push(`${window.location.pathname}?${params.toString()}`);
        }
    };

    const createPagination = () => {
        const buttons: (number | string)[] = [];

        if (totalPages <= 7) {

            for (let i = 1; i <= totalPages; i++) buttons.push(i);
        } else {

            if (page > 4) buttons.push(1, 'prevDots');
            const start = Math.max(1, page - 3);
            const end = Math.min(totalPages, page + 3);
            for (let i = start; i <= end; i++) buttons.push(i);
            if (page < totalPages - 3) buttons.push('nextDots', totalPages);
        }

        return buttons;
    };

    const paginationButtons = createPagination();

    if (totalPages <= 1) return null;

    return (
        <div className="paginationButtons">
            <button
                onClick={() => handlePageClick(page - 1)}
                disabled={page === 1}
            >
                ←
            </button>

            {paginationButtons.map((btn, idx) => {
                if (btn === 'prevDots') {
                    return (
                        <button key={idx} onClick={() => handlePageClick(Math.max(page - 7, 1))}>
                            ...
                        </button>
                    );
                }
                if (btn === 'nextDots') {
                    return (
                        <button key={idx} onClick={() => handlePageClick(Math.min(page + 7, totalPages))}>
                            ...
                        </button>
                    );
                }
                return (
                    <button
                        key={idx}
                        onClick={() => handlePageClick(btn as number)}
                        className={page === btn ? "active" : ""}
                    >
                        {btn}
                    </button>
                );
            })}

            <button
                onClick={() => handlePageClick(page + 1)}
                disabled={page === totalPages}
            >
                →
            </button>
        </div>
    );
}

