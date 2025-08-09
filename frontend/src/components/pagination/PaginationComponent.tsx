'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function PaginationComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const page = +(searchParams.get('page') || '1');

    const handleNext = () => {
        router.push(`?page=${page + 1}`);
    };

    const handlePrev = () => {
        if (page > 1) {
            router.push(`?page=${page - 1}`);
        }
    };

    const handleNumber = (num: number) => {
        router.push(`?page=${num}`);
    };

    return (
        <div>
            <button disabled={page === 1} onClick={handlePrev}>Prev</button>

            {/* Генеруємо кнопки */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(num => (
                <button
                    key={num}
                    onClick={() => handleNumber(num)}
                    disabled={page === num}
                >
                    {num}
                </button>
            ))}

            <button onClick={handleNext}>Next</button>
        </div>
    );
}
