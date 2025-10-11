'use client';

import { useState } from 'react';
import './admin-component.css';
import {managerService} from "@/app/services/manager.service";

export default function AdminComponent() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        surname: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Форма відправлена:', formData);
        setShowForm(false);
        setFormData({ email: '', name: '', surname: '' });
    };

    const handleCancel = () => {
        setShowForm(false);
        setFormData({ email: '', name: '', surname: '' });
    };
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

    return (
        <div className="admin-component">
            <button className="button-create" onClick={() => setShowForm(true)}>
                CREATE
            </button>

            {showForm && (
                <div className="form-overlay">
                    <form className="manager-form" onSubmit={handleSubmit}>
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
                            <button type="submit" className="create" onClick={handleCreate}>
                                CREATE
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div>статистика</div>


        </div>
    );
}
