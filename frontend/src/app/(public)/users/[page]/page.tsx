// 'use client';
//
// import { useEffect, useState } from 'react';
// import { IUser } from '@/app/models/IUser';
// import { userService } from '@/app/services/user.service';
//
// export default function UsersComponent() {
//     const [users, setUsers] = useState<IUser[]>([]);
//     const [page, setPage] = useState<number>(1);
//     const limit = 25; // фіксовано 25 користувачів на сторінку
//
//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const data = await userService.getAllUsers(page, limit);
//                 setUsers(data);
//             } catch (err) {
//                 console.error('Помилка при завантаженні користувачів:', err);
//             }
//         };
//
//         fetchUsers();
//     }, [page]);
//
//     // Визначимо, чи є наступна сторінка, за умовою, що якщо на сторінці менше 25 користувачів — наступної немає
//     const hasNextPage = users.length === limit;
//
//     return (
//         <div>
//             <h1>Список користувачів</h1>
//             <ul>
//                 {users.map((user, index) => (
//                     <li key={user._id}>
//                         {(page - 1) * limit + index + 1}. {user.email} {user.name}
//                     </li>
//                 ))}
//             </ul>
//
//             <div style={{ marginTop: 20 }}>
//                 <button
//                     onClick={() => setPage((p) => Math.max(p - 1, 1))}
//                     disabled={page === 1}
//                 >
//                     Назад
//                 </button>
//
//                 <span style={{ margin: '0 10px' }}>
//           Сторінка {page}
//         </span>
//
//                 <button
//                     onClick={() => hasNextPage && setPage((p) => p + 1)}
//                     disabled={!hasNextPage}
//                 >
//                     Вперед
//                 </button>
//             </div>
//         </div>
//     );
// }
