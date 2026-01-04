// 'use client';
//
// import { useEffect, useState, useCallback } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { IUser } from "@/app/models/IUser";
// import { IComment } from "@/app/models/IComment";
// import { userService } from "@/app/services/user.service";
// import { commentService } from "@/app/services/comment.service";
// import { sortData } from "@/app/helpers/sortData";
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
//
// import HeaderComponent from "@/app/components/header/HeaderComponent";
// import CommentComponent from "@/app/components/comments/CommentsComponent";
// import UserUpdateComponent from "@/app/components/userUpdate/UserUpdateComponent";
// import FilterComponent from "@/app/components/filter/FilterComponent";
//
// import "./users-component.css";
// import { FaFileExcel } from "react-icons/fa";
// import { getUserRole } from "@/app/helpers/role";
//
// const defaultFilters: Record<string, string> = {
//     name: "", surname: "", email: "", phone: "", age: "",
//     course: "", course_format: "", course_type: "", status: "", group: "",
//     startDate: "", endDate: "",
// };
//
// export default function UsersComponent() {
//     const searchParams = useSearchParams();
//     const router = useRouter();
//
//     const [users, setUsers] = useState<IUser[]>([]);
//     const [totalUsers, setTotalUsers] = useState<number>(0);
//     const [openUserId, setOpenUserId] = useState<string | null>(null);
//     const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
//     const [comments, setComments] = useState<Record<string, IComment[]>>({});
//     const [newComment, setNewComment] = useState<Record<string, string>>({});
//     const [filters, setFilters] = useState<Record<string, string>>(defaultFilters);
//     const [debouncedFilters, setDebouncedFilters] = useState<Record<string, string>>(defaultFilters);
//     const [myOnly, setMyOnly] = useState(false);
//
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const sortColumn = searchParams.get("order") || "created_at";
//     const sortOrder = (searchParams.get("direction") as "asc" | "desc") || "desc";
//     const usersPerPage = 25;
//
//     const displayValue = (value: any) => value === null || value === undefined || value === "" ? "null" : value;
//
//
//     useEffect(() => {
//         const handler = setTimeout(() => setDebouncedFilters(filters), 500);
//         return () => clearTimeout(handler);
//     }, [filters]);
//
//     //FILTER OLD
//
//     const handleFilterChange = (field: string, value: string) => {
//         setFilters(prev => ({ ...prev, [field]: value }));
//
//         const params = new URLSearchParams(window.location.search);
//
//         if (value.trim()) {
//             params.set(field, value);
//         } else {
//             params.delete(field);
//         }
//
//         router.replace(
//             `${window.location.pathname}?${params.toString()}`,
//             { scroll: false }
//         );
//     };
//
//
//
//     const resetFilters = () => {
//         setFilters(defaultFilters);
//         setDebouncedFilters(defaultFilters);
//         const params = new URLSearchParams(window.location.search);
//         params.set("page", "1");
//         router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
//         setMyOnly(false);
//     };
//
//
//     const fetchUsers = useCallback(async () => {
//         try {
//             const response = await userService.getAllUsers(page) as { data: IUser[]; total: number };
//             const total = response.total || response.data?.length || 0;
//             setTotalUsers(total);
//
//             let fetchedUsers: IUser[] = response.data ?? [];
//
//             fetchedUsers = fetchedUsers.filter(user => {
//                 return Object.entries(debouncedFilters).every(([key, value]) => {
//                     if (!value) return true;
//                     if (key === "startDate" && debouncedFilters.endDate) {
//                         const userDate = new Date(user.created_at);
//                         const start = new Date(debouncedFilters.startDate);
//                         const end = new Date(debouncedFilters.endDate);
//                         return userDate >= start && userDate <= end;
//                     }
//                     const userValue = (user as any)[key];
//                     return userValue && userValue.toString().toLowerCase().includes(value.toLowerCase());
//                 });
//             });
//
//             if (myOnly) {
//                 fetchedUsers = fetchedUsers.filter(u => u.manager === getUserRole());
//             }
//
//
//             setUsers(sortData(fetchedUsers, sortColumn, sortOrder));
//         } catch (err) {
//             console.error("Помилка завантаження:", err);
//             setUsers([]);
//             setTotalUsers(0);
//         }
//     }, [debouncedFilters, page, sortColumn, sortOrder, myOnly]);
//
//     useEffect(() => { fetchUsers(); }, [fetchUsers]);
//
//
//     const loadComments = async (user: IUser) => {
//         if (comments[user._id]) return;
//         try {
//             const userComments = await commentService.getCommentsByUser(user.id.toString());
//             setComments(prev => ({ ...prev, [user._id]: userComments }));
//         } catch {
//             setComments(prev => ({ ...prev, [user._id]: [] }));
//         }
//     };
//
//     const toggleComments = async (userId: string, user: IUser) => {
//         const newOpen = openUserId === userId ? null : userId;
//         setOpenUserId(newOpen);
//         if (newOpen) await loadComments(user);
//     };
//
//     const handleInputChange = (userId: string, value: string) =>
//         setNewComment(prev => ({ ...prev, [userId]: value }));
//
//     const handleAddComment = useCallback(async (user: IUser) => {
//         const text = newComment[user._id];
//         if (!text) return;
//
//         try {
//             const role = getUserRole();
//             if (!role) return;
//
//             const dto: IComment = {
//                 userId: user._id,
//                 crmId: user.id,
//                 content: text,
//                 manager: role,
//                 createdAt: new Date().toISOString(),
//                 title: "",
//             };
//
//             const savedComment = await commentService.createComment(dto);
//
//             setComments(prev => ({
//                 ...prev,
//                 [user._id]: [...(prev[user._id] || []), savedComment],
//             }));
//
//             const updated = await userService.updateUserById(user._id, {
//                 status: "In Work",
//                 manager: role,
//             });
//
//             setUsers(prev => prev.map(u => (u._id === user._id ? { ...u, ...updated } : u)));
//             handleInputChange(user._id, "");
//         } catch (err) {
//             console.error("Помилка при створенні коментаря:", err);
//         }
//     }, [newComment]);
//
//     const handleUpdateUser = (updatedUser: IUser) => {
//         setUsers(prev => prev.map(u => (u._id === updatedUser._id ? { ...u, ...updatedUser } : u)));
//     };
//
//     const handleSortChange = (column: string, order: "asc" | "desc") => {
//         const params = new URLSearchParams(window.location.search);
//         params.set("order", column);
//         params.set("direction", order);
//         router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
//     };
//
//     const handleExportExcel = () => {
//         if (!users.length) return;
//         const worksheet = XLSX.utils.json_to_sheet(users.map(u => ({
//             id: u.id, name: u.name, surname: u.surname, email: u.email, phone: u.phone,
//             age: u.age, course: u.course, course_format: u.course_format, course_type: u.course_type,
//             status: u.status, sum: u.sum, already_paid: u.already_paid, group: u.group,
//             created_at: u.created_at, manager: u.manager
//         })));
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
//         const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//         const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
//         saveAs(data, 'users.xlsx');
//     };
//
//     return (
//         <div className="users-container">
//             <div className="filter-wrapper">
//                 <FilterComponent filters={filters} onFilterChange={handleFilterChange}/>
//                 <div className="filter-wrapper-buttons">
//                     <label className="my-checkbox">
//                         <input type="checkbox" checked={myOnly} onChange={() => setMyOnly(!myOnly)}/> My
//                     </label>
//                     <button className="reset-button" title="Скинути фільтри" onClick={resetFilters}>⟳</button>
//                     <button className="excel-button" title="Експорт в Excel" onClick={handleExportExcel}>
//                         <FaFileExcel size={24}/>
//                     </button>
//                 </div>
//             </div>
//
//             <HeaderComponent sortColumn={sortColumn} sortOrder={sortOrder} onSortChange={handleSortChange}/>
//
//             {users.length > 0 ? (
//                 users.map(user => (
//                     <div key={user._id} className="user-block">
//                         <ul className="user-row" onClick={() => toggleComments(user._id, user)}>
//                             <li>{displayValue(user.id)}</li>
//                             <li>{displayValue(user.name)}</li>
//                             <li>{displayValue(user.surname)}</li>
//                             <li>{displayValue(user.email)}</li>
//                             <li>{displayValue(user.phone)}</li>
//                             <li>{displayValue(user.age)}</li>
//                             <li>{displayValue(user.course)}</li>
//                             <li>{displayValue(user.course_format)}</li>
//                             <li>{displayValue(user.course_type)}</li>
//                             <li>{displayValue(user.status || "New")}</li>
//                             <li>{displayValue(user.sum)}</li>
//                             <li>{displayValue(user.already_paid)}</li>
//                             <li>{displayValue(user.group)}</li>
//                             <li>{user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric'}) : 'null'}</li>
//                             <li>{displayValue(user.manager || 'null')}</li>
//                         </ul>
//                         {openUserId === user._id && (
//                             <CommentComponent
//                                 user={user}
//                                 comments={comments}
//                                 newComment={newComment}
//                                 handleInputChange={handleInputChange}
//                                 handleAddComment={handleAddComment}
//                                 onUpdateUser={handleUpdateUser}
//                             />
//                         )}
//                     </div>
//                 ))
//             ) : <p>Немає даних</p>}
//
//             {selectedUser && (
//                 <UserUpdateComponent
//                     user={selectedUser}
//                     onClose={() => setSelectedUser(null)}
//                     onUpdateUser={handleUpdateUser}
//                 />
//             )}
//         </div>
//     );
// }
//
//
//
//
//
//
//
//
//

// 'use client';
//
// import { useEffect, useState, useCallback } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { IUser } from "@/app/models/IUser";
// import { IComment } from "@/app/models/IComment";
// import { userService } from "@/app/services/user.service";
// import { commentService } from "@/app/services/comment.service";
// import { sortData } from "@/app/helpers/sortData";
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
//
// import HeaderComponent from "@/app/components/header/HeaderComponent";
// import CommentComponent from "@/app/components/comments/CommentsComponent";
// import UserUpdateComponent from "@/app/components/userUpdate/UserUpdateComponent";
// import FilterComponent from "@/app/components/filter/FilterComponent";
//
// import "./users-component.css";
// import { FaFileExcel } from "react-icons/fa";
// import { getUserRole } from "@/app/helpers/role";
//
// const defaultFilters: Record<string, string> = {
//     name: "", surname: "", email: "", phone: "", age: "",
//     course: "", course_format: "", course_type: "", status: "", group: "",
//     startDate: "", endDate: "",
// };
//
// export default function UsersComponent() {
//     const searchParams = useSearchParams();
//     const router = useRouter();
//
//     const [users, setUsers] = useState<IUser[]>([]);
//     const [totalUsers, setTotalUsers] = useState<number>(0);
//     const [openUserId, setOpenUserId] = useState<string | null>(null);
//     const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
//     const [comments, setComments] = useState<Record<string, IComment[]>>({});
//     const [newComment, setNewComment] = useState<Record<string, string>>({});
//     const [filters, setFilters] = useState<Record<string, string>>(defaultFilters);
//     const [debouncedFilters, setDebouncedFilters] = useState<Record<string, string>>(defaultFilters);
//     const [myOnly, setMyOnly] = useState(false);
//
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const sortColumn = searchParams.get("order") || "created_at";
//     const sortOrder = (searchParams.get("direction") as "asc" | "desc") || "desc";
//     const usersPerPage = 25;
//
//     const displayValue = (value: any) => value === null || value === undefined || value === "" ? "null" : value;
//
//
//     useEffect(() => {
//         const handler = setTimeout(() => setDebouncedFilters(filters), 500);
//         return () => clearTimeout(handler);
//     }, [filters]);
//
//     //FILTER OLD
//
//     const handleFilterChange = (field: string, value: string) => {
//         const newFilters = {
//             ...filters,
//             [field]: value,
//         };
//
//         setFilters(newFilters);
//
//         const params = new URLSearchParams();
//
//         // фільтри
//         Object.entries(newFilters).forEach(([key, val]) => {
//             if (val && val.trim()) {
//                 params.set(key, val);
//             }
//         });
//
//         // завжди на 1 сторінку при фільтрації
//         params.set("page", "1");
//         params.set("limit", usersPerPage.toString());
//
//         // сортування зберігаємо
//         params.set("orderBy", sortColumn);
//         params.set("order", sortOrder);
//
//         router.replace(
//             `${window.location.pathname}?${params.toString()}`,
//             { scroll: false }
//         );
//     };
//
//
//
//     const resetFilters = () => {
//         setFilters(defaultFilters);
//         setDebouncedFilters(defaultFilters);
//         const params = new URLSearchParams(window.location.search);
//         params.set("page", "1");
//         router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
//         setMyOnly(false);
//     };
//
//
//     const fetchUsers = useCallback(async () => {
//         try {
//             const params = new URLSearchParams();
//
//             params.set("page", page.toString());
//             params.set("limit", usersPerPage.toString());
//             params.set("orderBy", sortColumn);
//             params.set("order", sortOrder);
//
//             Object.entries(debouncedFilters).forEach(([key, value]) => {
//                 if (value && value.trim()) {
//                     params.set(key, value);
//                 }
//             });
//
//             if (myOnly) {
//                 params.set("myOnly", getUserRole());
//             }
//
//             const response = await userService.getFilterUsers(
//                 `?${params.toString()}`
//             );
//
//             setUsers(response.data);
//             setTotalUsers(response.total);
//         } catch (err) {
//             console.error("Помилка завантаження:", err);
//             setUsers([]);
//             setTotalUsers(0);
//         }
//     }, [page, sortColumn, sortOrder, debouncedFilters, myOnly]);
//
//
//
//     useEffect(() => { fetchUsers(); }, [fetchUsers]);
//
//
//     const loadComments = async (user: IUser) => {
//         if (comments[user._id]) return;
//         try {
//             const userComments = await commentService.getCommentsByUser(user.id.toString());
//             setComments(prev => ({ ...prev, [user._id]: userComments }));
//         } catch {
//             setComments(prev => ({ ...prev, [user._id]: [] }));
//         }
//     };
//
//     const toggleComments = async (userId: string, user: IUser) => {
//         const newOpen = openUserId === userId ? null : userId;
//         setOpenUserId(newOpen);
//         if (newOpen) await loadComments(user);
//     };
//
//     const handleInputChange = (userId: string, value: string) =>
//         setNewComment(prev => ({ ...prev, [userId]: value }));
//
//     const handleAddComment = useCallback(async (user: IUser) => {
//         const text = newComment[user._id];
//         if (!text) return;
//
//         try {
//             const role = getUserRole();
//             if (!role) return;
//
//             const dto: IComment = {
//                 userId: user._id,
//                 crmId: user.id,
//                 content: text,
//                 manager: role,
//                 createdAt: new Date().toISOString(),
//                 title: "",
//             };
//
//             const savedComment = await commentService.createComment(dto);
//
//             setComments(prev => ({
//                 ...prev,
//                 [user._id]: [...(prev[user._id] || []), savedComment],
//             }));
//
//             const updated = await userService.updateUserById(user._id, {
//                 status: "In Work",
//                 manager: role,
//             });
//
//             setUsers(prev => prev.map(u => (u._id === user._id ? { ...u, ...updated } : u)));
//             handleInputChange(user._id, "");
//         } catch (err) {
//             console.error("Помилка при створенні коментаря:", err);
//         }
//     }, [newComment]);
//
//     const handleUpdateUser = (updatedUser: IUser) => {
//         setUsers(prev => prev.map(u => (u._id === updatedUser._id ? { ...u, ...updatedUser } : u)));
//     };
//
//     const handleSortChange = (column: string, order: "asc" | "desc") => {
//         const params = new URLSearchParams(window.location.search);
//         params.set("order", column);
//         params.set("direction", order);
//         router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
//     };
//
//     const handleExportExcel = () => {
//         if (!users.length) return;
//         const worksheet = XLSX.utils.json_to_sheet(users.map(u => ({
//             id: u.id, name: u.name, surname: u.surname, email: u.email, phone: u.phone,
//             age: u.age, course: u.course, course_format: u.course_format, course_type: u.course_type,
//             status: u.status, sum: u.sum, already_paid: u.already_paid, group: u.group,
//             created_at: u.created_at, manager: u.manager
//         })));
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
//         const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//         const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
//         saveAs(data, 'users.xlsx');
//     };
//
//     return (
//         <div className="users-container">
//             <div className="filter-wrapper">
//                 <FilterComponent filters={filters} onFilterChange={handleFilterChange}/>
//                 <div className="filter-wrapper-buttons">
//                     <label className="my-checkbox">
//                         <input type="checkbox" checked={myOnly} onChange={() => setMyOnly(!myOnly)}/> My
//                     </label>
//                     <button className="reset-button" title="Скинути фільтри" onClick={resetFilters}>⟳</button>
//                     <button className="excel-button" title="Експорт в Excel" onClick={handleExportExcel}>
//                         <FaFileExcel size={24}/>
//                     </button>
//                 </div>
//             </div>
//
//             <HeaderComponent sortColumn={sortColumn} sortOrder={sortOrder} onSortChange={handleSortChange}/>
//
//             {users.length > 0 ? (
//                 users.map(user => (
//                     <div key={user._id} className="user-block">
//                         <ul className="user-row" onClick={() => toggleComments(user._id, user)}>
//                             <li>{displayValue(user.id)}</li>
//                             <li>{displayValue(user.name)}</li>
//                             <li>{displayValue(user.surname)}</li>
//                             <li>{displayValue(user.email)}</li>
//                             <li>{displayValue(user.phone)}</li>
//                             <li>{displayValue(user.age)}</li>
//                             <li>{displayValue(user.course)}</li>
//                             <li>{displayValue(user.course_format)}</li>
//                             <li>{displayValue(user.course_type)}</li>
//                             <li>{displayValue(user.status || "New")}</li>
//                             <li>{displayValue(user.sum)}</li>
//                             <li>{displayValue(user.already_paid)}</li>
//                             <li>{displayValue(user.group)}</li>
//                             <li>{user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric'}) : 'null'}</li>
//                             <li>{displayValue(user.manager || 'null')}</li>
//                         </ul>
//                         {openUserId === user._id && (
//                             <CommentComponent
//                                 user={user}
//                                 comments={comments}
//                                 newComment={newComment}
//                                 handleInputChange={handleInputChange}
//                                 handleAddComment={handleAddComment}
//                                 onUpdateUser={handleUpdateUser}
//                             />
//                         )}
//                     </div>
//                 ))
//             ) : <p>Немає даних</p>}
//
//             {selectedUser && (
//                 <UserUpdateComponent
//                     user={selectedUser}
//                     onClose={() => setSelectedUser(null)}
//                     onUpdateUser={handleUpdateUser}
//                 />
//             )}
//         </div>
//     );
// }


// 'use client';
// import { useEffect, useState, useCallback } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { IUser } from "@/app/models/IUser";
// import { IComment } from "@/app/models/IComment";
// import { userService } from "@/app/services/user.service";
// import { commentService } from "@/app/services/comment.service";
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
//
// import "./users-component.css";
// import CommentComponent from "@/app/components/comments/CommentsComponent";
// import UserUpdateComponent from "@/app/components/userUpdate/UserUpdateComponent";
// import { getUserRole } from "@/app/helpers/role";
// import FilterComponent from "../filter/FilterComponent";
// import HeaderComponent from "@/app/components/header/HeaderComponent";
//
// const defaultFilters: Record<string, string> = {
//     name: "", surname: "", email: "", phone: "", age: "",
//     course: "", course_format: "", course_type: "", status: "", group: "",
//     startDate: "", endDate: "",
// };
//
// const ORDER_BY_MAP: Record<string, string> = {
//     name: "name",
//     age: "age",
//     created_at: "createdAt",
// };
//
// export default function UsersComponent() {
//     const searchParams = useSearchParams();
//     const router = useRouter();
//
//     const [users, setUsers] = useState<IUser[]>([]);
//     const [totalUsers, setTotalUsers] = useState<number>(0);
//     const [openUserId, setOpenUserId] = useState<string | null>(null);
//     const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
//     const [comments, setComments] = useState<Record<string, IComment[]>>({});
//     const [newComment, setNewComment] = useState<Record<string, string>>({});
//     const [filters, setFilters] = useState<Record<string, string>>(defaultFilters);
//     const [debouncedFilters, setDebouncedFilters] = useState<Record<string, string>>(defaultFilters);
//     const [myOnly, setMyOnly] = useState(false);
//
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const rawSortColumn = searchParams.get("order") || "created_at";
//     const sortColumn = ORDER_BY_MAP[rawSortColumn] || "createdAt";
//     const sortOrder = (searchParams.get("direction") as "asc" | "desc") || "desc";
//     const usersPerPage = 25;
//
//     const displayValue = (value: any) => value === null || value === undefined || value === "" ? "null" : value;
//
//     useEffect(() => {
//         const handler = setTimeout(() => setDebouncedFilters(filters), 500);
//         return () => clearTimeout(handler);
//     }, [filters]);
//
//     const handleFilterChange = (field: string, value: string) => {
//         const newFilters = { ...filters, [field]: value };
//         setFilters(newFilters);
//
//         const params = new URLSearchParams();
//         Object.entries(newFilters).forEach(([k, v]) => { if (v) params.set(k, v); });
//         params.set("page", "1");
//         params.set("limit", usersPerPage.toString());
//         params.set("orderBy", sortColumn);
//         params.set("order", sortOrder);
//         router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
//     };
//
//     const resetFilters = () => {
//         setFilters(defaultFilters);
//         setDebouncedFilters(defaultFilters);
//         const params = new URLSearchParams();
//         params.set("page", "1");
//         router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
//         setMyOnly(false);
//     };
//
//     const fetchUsers = useCallback(async () => {
//         try {
//             const params = new URLSearchParams();
//             params.set("page", page.toString());
//             params.set("limit", usersPerPage.toString());
//             params.set("orderBy", sortColumn);
//             params.set("order", sortOrder);
//             Object.entries(debouncedFilters).forEach(([k, v]) => { if (v) params.set(k, v); });
//             if (myOnly) {
//                 params.set("myOnly", getUserRole());
//             }
//
//             const response = await userService.getFilterUsers(`?${params.toString()}`);
//             let fetchedUsers = response.data;
//
//             // відсортуємо за замовчуванням: останні створені зверху
//             if (!searchParams.get("order")) {
//                 fetchedUsers = fetchedUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//             }
//
//             setUsers(fetchedUsers);
//             setTotalUsers(response.total);
//         } catch (err) {
//             console.error("Помилка завантаження:", err);
//             setUsers([]);
//             setTotalUsers(0);
//         }
//     }, [page, sortColumn, sortOrder, debouncedFilters, myOnly, searchParams]);
//
//     useEffect(() => { fetchUsers(); }, [fetchUsers]);
//
//     const toggleComments = async (userId: string, user: IUser) => {
//         const newOpen = openUserId === userId ? null : userId;
//         setOpenUserId(newOpen);
//         if (newOpen && !comments[user._id]) {
//             try {
//                 const userComments = await commentService.getCommentsByUser(user.id.toString());
//                 setComments(prev => ({ ...prev, [user._id]: userComments }));
//             } catch { setComments(prev => ({ ...prev, [user._id]: [] })); }
//         }
//     };
//
//     const handleInputChange = (userId: string, value: string) =>
//         setNewComment(prev => ({ ...prev, [userId]: value }));
//
//     const handleAddComment = useCallback(async (user: IUser) => {
//         const text = newComment[user._id];
//         if (!text) return;
//         try {
//             const role = getUserRole();
//             if (!role) return;
//
//             const savedComment = await commentService.createComment({
//                 userId: user._id, crmId: user.id, content: text, manager: role, createdAt: new Date().toISOString(), title: ""
//             });
//
//             setComments(prev => ({
//                 ...prev,
//                 [user._id]: [...(prev[user._id] || []), savedComment],
//             }));
//
//             const updated = await userService.updateUserById(user._id, { status: "In Work", manager: role });
//             setUsers(prev => prev.map(u => u._id === user._id ? { ...u, ...updated } : u));
//             handleInputChange(user._id, "");
//         } catch (err) { console.error(err); }
//     }, [newComment]);
//
//     const handleSortChange = (column: string, order: "asc" | "desc") => {
//         const params = new URLSearchParams(window.location.search);
//         params.set("order", column);
//         params.set("direction", order);
//         router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
//     };
//
//     const handleExportExcel = () => {
//         if (!users.length) return;
//         const ws = XLSX.utils.json_to_sheet(users.map(u => ({
//             id: u.id, name: u.name, surname: u.surname, email: u.email, phone: u.phone,
//             age: u.age, course: u.course, course_format: u.course_format, course_type: u.course_type,
//             status: u.status, sum: u.sum, already_paid: u.already_paid, group: u.group,
//             created_at: u.created_at, manager: u.manager
//         })));
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Users');
//         const data = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], { type: 'application/octet-stream' });
//         saveAs(data, 'users.xlsx');
//     };
//
//     return (
//         <div className="users-container">
//             <div className="filter-wrapper">
//                 <FilterComponent filters={filters} onFilterChange={handleFilterChange} />
//                 <div className="filter-wrapper-buttons">
//                     <label className="my-checkbox">
//                         <input type="checkbox" checked={myOnly} onChange={() => setMyOnly(!myOnly)} /> My
//                     </label>
//                     <button onClick={resetFilters}>⟳</button>
//                     <button onClick={handleExportExcel}>Export Excel</button>
//                 </div>
//             </div>
//
//             <HeaderComponent sortColumn={sortColumn} sortOrder={sortOrder} onSortChange={handleSortChange} />
//
//             {users.length > 0 ? users.map(u => (
//                 <div key={u._id} className="user-block">
//                     <ul className="user-row" onClick={() => toggleComments(u._id, u)}>
//                         <li>{displayValue(u.id)}</li>
//                         <li>{displayValue(u.name)}</li>
//                         <li>{displayValue(u.surname)}</li>
//                         <li>{displayValue(u.email)}</li>
//                         <li>{displayValue(u.phone)}</li>
//                         <li>{displayValue(u.age)}</li>
//                         <li>{displayValue(u.course)}</li>
//                         <li>{displayValue(u.course_format)}</li>
//                         <li>{displayValue(u.course_type)}</li>
//                         <li>{displayValue(u.status || "New")}</li>
//                         <li>{displayValue(u.sum)}</li>
//                         <li>{displayValue(u.already_paid)}</li>
//                         <li>{displayValue(u.group)}</li>
//                         <li>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "null"}</li>
//                         <li>{displayValue(u.manager || "null")}</li>
//                     </ul>
//
//                     {openUserId === u._id && (
//                         <CommentComponent
//                             user={u}
//                             comments={comments}
//                             newComment={newComment}
//                             handleInputChange={handleInputChange}
//                             handleAddComment={handleAddComment}
//                             onUpdateUser={(updated) => setUsers(prev => prev.map(us => us._id === updated._id ? updated : us))}
//                         />
//                     )}
//                 </div>
//             )) : <p>No data</p>}
//
//             {selectedUser && (
//                 <UserUpdateComponent
//                     user={selectedUser}
//                     onClose={() => setSelectedUser(null)}
//                     onUpdateUser={(updated) => setUsers(prev => prev.map(u => u._id === updated._id ? updated : u))}
//                 />
//             )}
//         </div>
//     );
// }


'use client';

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IUser } from "@/app/models/IUser";
import { IComment } from "@/app/models/IComment";
import { userService } from "@/app/services/user.service";
import { commentService } from "@/app/services/comment.service";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import CommentComponent from "@/app/components/comments/CommentsComponent";
import UserUpdateComponent from "@/app/components/userUpdate/UserUpdateComponent";
import FilterComponent from "../filter/FilterComponent";
import HeaderComponent from "@/app/components/header/HeaderComponent";
import { getUserRole } from "@/app/helpers/role";

import "./users-component.css";

const defaultFilters: Record<string, string> = {
    name: "", surname: "", email: "", phone: "", age: "",
    course: "", course_format: "", course_type: "", status: "", group: "",
    startDate: "", endDate: "",
};

export default function UsersComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [users, setUsers] = useState<IUser[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [openUserId, setOpenUserId] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [comments, setComments] = useState<Record<string, IComment[]>>({});
    const [newComment, setNewComment] = useState<Record<string, string>>({});
    const [filters, setFilters] = useState<Record<string, string>>(defaultFilters);
    const [debouncedFilters, setDebouncedFilters] = useState<Record<string, string>>(defaultFilters);
    const [myOnly, setMyOnly] = useState(false);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const sortColumn = searchParams.get("order") || "created_at";
    const sortOrder = (searchParams.get("direction") as "asc" | "desc") || "desc";
    const usersPerPage = 25;

    const displayValue = (value: any) => value === null || value === undefined || value === "" ? "null" : value;

    // debounce для фільтрів
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedFilters(filters), 500);
        return () => clearTimeout(handler);
    }, [filters]);

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));

        const params = new URLSearchParams(window.location.search);
        if (value.trim()) params.set(field, value);
        else params.delete(field);

        params.set("page", "1");
        router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
    };

    const resetFilters = () => {
        setFilters(defaultFilters);
        setDebouncedFilters(defaultFilters);
        const params = new URLSearchParams();
        params.set("page", "1");
        router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
        setMyOnly(false);
    };

    const fetchUsers = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            params.set("page", page.toString());
            params.set("limit", usersPerPage.toString());

            Object.entries(debouncedFilters).forEach(([k, v]) => { if (v) params.set(k, v); });
            if (myOnly && getUserRole()) params.set("myOnly", getUserRole()!);

            const response = await userService.getFilterUsers(`?${params.toString()}`);
            let fetchedUsers: IUser[] = response.data;

            // Сортуємо по _id від останнього до першого
            fetchedUsers = fetchedUsers.sort((a, b) => a._id > b._id ? -1 : 1);

            setUsers(fetchedUsers);
            setTotalUsers(response.total);
        } catch (err) {
            console.error("Помилка завантаження:", err);
            setUsers([]);
            setTotalUsers(0);
        }
    }, [page, debouncedFilters, myOnly]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const toggleComments = async (userId: string, user: IUser) => {
        const newOpen = openUserId === userId ? null : userId;
        setOpenUserId(newOpen);
        if (newOpen && !comments[user._id]) {
            try {
                const userComments = await commentService.getCommentsByUser(user.id.toString());
                setComments(prev => ({ ...prev, [user._id]: userComments }));
            } catch {
                setComments(prev => ({ ...prev, [user._id]: [] }));
            }
        }
    };

    const handleInputChange = (userId: string, value: string) =>
        setNewComment(prev => ({ ...prev, [userId]: value }));

    const handleAddComment = useCallback(async (user: IUser) => {
        const text = newComment[user._id];
        if (!text) return;

        try {
            const role = getUserRole();
            if (!role) return;

            const savedComment = await commentService.createComment({
                userId: user._id,
                crmId: user.id,
                content: text,
                manager: role,
                createdAt: new Date().toISOString(),
                title: ""
            });

            setComments(prev => ({
                ...prev,
                [user._id]: [...(prev[user._id] || []), savedComment],
            }));

            const updated = await userService.updateUserById(user._id, { status: "In Work", manager: role });
            setUsers(prev => prev.map(u => u._id === user._id ? { ...u, ...updated } : u));

            handleInputChange(user._id, "");
        } catch (err) { console.error(err); }
    }, [newComment]);

    const handleSortChange = (column: string, order: "asc" | "desc") => {
        const params = new URLSearchParams(window.location.search);
        params.set("order", column);
        params.set("direction", order);
        router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
    };

    const handleExportExcel = () => {
        if (!users.length) return;
        const ws = XLSX.utils.json_to_sheet(users.map(u => ({
            id: u.id, name: u.name, surname: u.surname, email: u.email, phone: u.phone,
            age: u.age, course: u.course, course_format: u.course_format, course_type: u.course_type,
            status: u.status, sum: u.sum, already_paid: u.already_paid, group: u.group,
            created_at: u.created_at, manager: u.manager
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users');
        const data = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], { type: 'application/octet-stream' });
        saveAs(data, 'users.xlsx');
    };

    return (
        <div className="users-container">
            <div className="filter-wrapper">
                <FilterComponent filters={filters} onFilterChange={handleFilterChange} />
                <div className="filter-wrapper-buttons">
                    <label className="my-checkbox">
                        <input type="checkbox" checked={myOnly} onChange={() => setMyOnly(!myOnly)} /> My
                    </label>
                    <button onClick={resetFilters}>⟳</button>
                    <button onClick={handleExportExcel}>Export Excel</button>
                </div>
            </div>

            <HeaderComponent sortColumn={sortColumn} sortOrder={sortOrder} onSortChange={handleSortChange} />

            {users.length > 0 ? users.map(u => (
                <div key={u._id} className="user-block">
                    <ul className="user-row" onClick={() => toggleComments(u._id, u)}>
                        <li>{displayValue(u.id)}</li>
                        <li>{displayValue(u.name)}</li>
                        <li>{displayValue(u.surname)}</li>
                        <li>{displayValue(u.email)}</li>
                        <li>{displayValue(u.phone)}</li>
                        <li>{displayValue(u.age)}</li>
                        <li>{displayValue(u.course)}</li>
                        <li>{displayValue(u.course_format)}</li>
                        <li>{displayValue(u.course_type)}</li>
                        <li>{displayValue(u.status || "New")}</li>
                        <li>{displayValue(u.sum)}</li>
                        <li>{displayValue(u.already_paid)}</li>
                        <li>{displayValue(u.group)}</li>
                        <li>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "null"}</li>
                        <li>{displayValue(u.manager || "null")}</li>
                    </ul>

                    {openUserId === u._id && (
                        <CommentComponent
                            user={u}
                            comments={comments}
                            newComment={newComment}
                            handleInputChange={handleInputChange}
                            handleAddComment={handleAddComment}
                            onUpdateUser={(updated) => setUsers(prev => prev.map(us => us._id === updated._id ? updated : us))}
                        />
                    )}
                </div>
            )) : <p>No data</p>}

            {selectedUser && (
                <UserUpdateComponent
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onUpdateUser={(updated) => setUsers(prev => prev.map(u => u._id === updated._id ? updated : u))}
                />
            )}
        </div>
    );
}








