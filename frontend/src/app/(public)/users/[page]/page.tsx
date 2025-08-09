// 'use client';
//
// import { useEffect, useState } from 'react';
// import { IUser } from '@/app/models/IUser';
// import { userService } from '@/app/services/user.service';
//
// interface IUserResponse {
//     data: IUser[];
//     total: number;
//     limit: number;
//     page: number;
// }
//
// export default function UsersComponent() {
//     const [users, setUsers] = useState<IUser[]>([]);
//     const [page, setPage] = useState<number>(1);
//     const [total, setTotal] = useState<number>(0);
//     const [limit, setLimit] = useState<number>(25); // буде оновлено з сервера
//
//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const res: IUserResponse = await userService.getAllUsers(page, limit);
//                 setUsers(res.data);
//                 setTotal(res.total);
//                 setLimit(res.limit);
//                 // setPage(res.page);
//             } catch (err) {
//                 console.error('Помилка при завантаженні користувачів:', err);
//             }
//         };
//
//         fetchUsers();
//     }, [page]);
//
//     const totalPages = Math.ceil(total / limit);
//
//     return (
//         <div>
//             <h1>Список користувачів</h1>
//             <ul>
//                 {users.map((user, index) => (
//                     <li key={user._id}>
//                         {(page - 1) * limit + index + 1}. {user.email} {user.name} {user.surname}
//                     </li>
//                 ))}
//             </ul>
//
//             <div style={{ marginTop: 20 }}>
//                 <button
//                     onClick={() => setPage((p) => Math.max(p - 1, 1))}
//                     disabled={page <= 1}
//                 >
//                     Назад
//                 </button>
//
//                 <span style={{ margin: '0 10px' }}>
//           Сторінка {page} з {totalPages}
//         </span>
//
//                 <button
//                     onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
//                     disabled={page >= totalPages}
//                 >
//                     Вперед
//                 </button>
//             </div>
//         </div>
//     );
// }
