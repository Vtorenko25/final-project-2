// 'use client';
//
// import { useState } from 'react';
// import './admin-component.css';
// import {managerService} from "@/app/services/manager.service";
//
// export default function AdminComponent() {
//     const [showForm, setShowForm] = useState(false);
//     const [formData, setFormData] = useState({
//         email: '',
//         name: '',
//         surname: '',
//     });
//
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };
//
//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         console.log('Форма відправлена:', formData);
//         setShowForm(false);
//         setFormData({ email: '', name: '', surname: '' });
//     };
//
//     const handleCancel = () => {
//         setShowForm(false);
//         setFormData({ email: '', name: '', surname: '' });
//     };
//     const handleCreate = async (e: React.FormEvent) => {
//         e.preventDefault();
//
//         try {
//             const dto = formData;
//             const response = await managerService.createManager(dto);
//             console.log('Менеджер створений:', response);
//
//             setFormData({ email: '', name: '', surname: '' });
//             setShowForm(false);
//         } catch (error: any) {
//             console.error('Помилка створення менеджера:', error);
//             alert(error?.response?.data?.message || 'Сталася помилка при створенні менеджера');
//         }
//     };
//
//     return (
//         <div className="admin-component">
//             <button className="button-create" onClick={() => setShowForm(true)}>
//                 CREATE
//             </button>
//
//             {showForm && (
//                 <div className="form-overlay">
//                     <form className="manager-form" onSubmit={handleSubmit}>
//                         <label>Email:</label>
//                         <input
//                             type="email"
//                             placeholder="Email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             required
//                         />
//
//                         <label>Name:</label>
//                         <input
//                             type="text"
//                             name="name"
//                             placeholder="Name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             required
//                         />
//
//                         <label>Surname:</label>
//                         <input
//                             type="text"
//                             name="surname"
//                             placeholder="Surname"
//                             value={formData.surname}
//                             onChange={handleChange}
//                             required
//                         />
//
//                         <div className="buttons">
//                             <button type="button" className="cancel" onClick={handleCancel}>
//                                 CANCEL
//                             </button>
//                             <button type="submit" className="create" onClick={handleCreate}>
//                                 CREATE
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             )}
//
//             <div>
//                 Orders statistic
//
//             </div>
//
//
//         </div>
//     );
// }

'use client';

import { useEffect, useState } from 'react';
import './admin-component.css';
import { managerService } from "@/app/services/manager.service";
import { userService } from "@/app/services/user.service"; // ✅ будемо брати заявки з користувачів

export default function AdminComponent() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        surname: '',
    });

    const [stats, setStats] = useState({
        total: 0,
        agree: 0,
        inWork: 0,
        disagree: 0,
        dubbing: 0,
        new: 0,
    });

    // --- Змінюємо стан при вводі ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // --- Створення менеджера ---
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dto = formData;
            const response = await managerService.createManager(dto);
            console.log('Менеджер створений:', response);

            setFormData({ email: '', name: '', surname: '' });
            setShowForm(false);
        } catch (error: any) {
            console.error('Помилка створення менеджера:', error);
            alert(error?.response?.data?.message || 'Сталася помилка при створенні менеджера');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setFormData({ email: '', name: '', surname: '' });
    };

    // --- Отримання статистики ---
    const fetchStats = async () => {
        try {
            const data = await userService.getAllUsers(1); // припустимо, що getAllUsers повертає { data, total }
            const users = data.data || [];

            const stats = {
                total: users.length,
                agree: users.filter((u: any) => u.status === 'Agree').length,
                inWork: users.filter((u: any) => u.status === 'In Work').length,
                disagree: users.filter((u: any) => u.status === 'Disagree').length,
                dubbing: users.filter((u: any) => u.status === 'Dubbing').length,
                new: users.filter((u: any) => u.status === 'New').length,
            };

            setStats(stats);
        } catch (err) {
            console.error('Помилка при завантаженні статистики:', err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="admin-component">
            <button className="button-create" onClick={() => setShowForm(true)}>
                CREATE
            </button>

            {showForm && (
                <div className="form-overlay">
                    <form className="manager-form" onSubmit={handleCreate}>
                        <label>Email:</label>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <label>Surname:</label>
                        <input
                            type="text"
                            name="surname"
                            placeholder="Surname"
                            value={formData.surname}
                            onChange={handleChange}
                            required
                        />

                        <div className="buttons">
                            <button type="button" className="cancel" onClick={handleCancel}>
                                CANCEL
                            </button>
                            <button type="submit" className="create">
                                CREATE
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* --- Статистика --- */}
            <div className="stats-block">
                <h3>Orders statistic</h3>
                <ul>
                    <li><strong>Total:</strong> {stats.total}</li>
                    <li><strong>Agree:</strong> {stats.agree}</li>
                    <li><strong>In work:</strong> {stats.inWork}</li>
                    <li><strong>Disagree:</strong> {stats.disagree}</li>
                    <li><strong>Dubbing:</strong> {stats.dubbing}</li>
                    <li><strong>New:</strong> {stats.new}</li>
                </ul>
            </div>
        </div>
    );
}
