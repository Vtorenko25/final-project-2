'use client';

import { useEffect, useState } from 'react';
import './admin-component.css';
import { managerService } from "@/app/services/manager.service";
import { userService } from "@/app/services/user.service";
import {IFormData} from "@/app/models/IFormData";
import {IStatistic} from "@/app/models/IStatistic";


export default function AdminComponent() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<IFormData>({ email: '', name: '', surname: '' });
    const [stats, setStats] = useState<IStatistic>({ total: 0, agree: 0, inWork: 0, disagree: 0, dubbing: 0, new: 0 });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await managerService.createManager(formData);
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


    const fetchStats = async () => {
        try {
            const data = await userService.getUsersStatistic();
            setStats(data);
        } catch (err) {
            console.error('Помилка при завантаженні статистики:', err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="admin-component">
            <button className="button-create" onClick={() => setShowForm(true)}>CREATE</button>

            {showForm && (
                <div className="form-overlay">
                    <form className="manager-form" onSubmit={handleCreate}>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
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
                            <button type="button" className="cancel" onClick={handleCancel}>CANCEL</button>
                            <button type="submit" className="create">CREATE</button>
                        </div>
                    </form>
                </div>
            )}

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
