'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import "./pagination-component.css"

export default function PaginationComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const totalPages = 20;
    const rawPage = +(searchParams.get('page') || '1');

    const page = Math.min(Math.max(rawPage, 1), totalPages);

    const handlePageClick = (num: number) => {
        if (num >= 1 && num <= totalPages && num !== page) {
            router.push(`?page=${num}`);
        }
    };

    const createPagination = () => {
        const buttons: (number | string)[] = [];

        if (page === 1) {
            for (let i = 1; i <= 7; i++) buttons.push(i);
            buttons.push('nextDots');
            buttons.push(totalPages);
            buttons.push('nextArrow');
        }
        else if (page > 1 && page <= 7) {
            buttons.push('prevArrow');
            for (let i = 1; i <= 7; i++) buttons.push(i);
            buttons.push('nextDots');
            buttons.push(totalPages);
            buttons.push('nextArrow');
        }
        else if (page >= 14 && page < totalPages) {
            buttons.push('prevArrow');
            buttons.push(1);
            buttons.push('prevDots');
            for (let i = 14; i <= totalPages; i++) buttons.push(i);
            buttons.push('nextArrow');
        }
        else if (page === totalPages) {
            buttons.push('prevArrow');
            buttons.push(1);
            buttons.push('prevDots');
            for (let i = 14; i <= totalPages; i++) buttons.push(i);
        }
        else {
            buttons.push('prevArrow');
            buttons.push(1);
            buttons.push('prevDots');

            const start = page - 3;
            const end = page + 3;
            for (let i = start; i <= end; i++) {
                buttons.push(i);
            }

            buttons.push('nextDots');
            buttons.push(totalPages);
            buttons.push('nextArrow');
        }

        return buttons;
    };

    const paginationButtons = createPagination();

    return (
        <div className="paginationButtons">
            {paginationButtons.map((btn, idx) => {
                if (btn === 'prevArrow') {
                    return (
                        <button key={idx} onClick={() => handlePageClick(page - 1)}>
                            ←
                        </button>
                    );
                }
                if (btn === 'nextArrow') {
                    return (
                        <button key={idx} onClick={() => handlePageClick(page + 1)}>
                            →
                        </button>
                    );
                }
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
        </div>
    );
}


