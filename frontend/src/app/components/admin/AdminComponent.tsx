'use client';

import { useEffect, useState } from 'react';
import './admin-component.css';
import { managerService } from "@/app/services/manager.service";
import { userService } from "@/app/services/user.service";
import {IFormData} from "@/app/models/IFormData";
import {IStatistic} from "@/app/models/IStatistic";
import {IManager} from "@/app/models/IManager";


export default function AdminComponent() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<IFormData>({ email: '', name: '', surname: '' });
    const [stats, setStats] = useState<IStatistic>({ total: 0, agree: 0, inWork: 0, disagree: 0, dubbing: 0, new: 0 });
    const [managers, setManagers] = useState<IManager[]>([])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const managerDto: IManager = {
                email: formData.email,
                name: formData.name,
                surname: formData.surname,
                is_active: formData.is_active ?? "true",
                last_login: formData.last_login ?? "",
            };

            await managerService.createManager(managerDto);
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

    const fetchManager = async (page: number) => {
        try {
            const data = await managerService.getAllManagers(page);
            setManagers(data.data ?? []);
        } catch (err) {
            console.error('Помилка при завантаженні менеджерів:', err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);
    useEffect(() => {
        fetchManager(1);
    }, []);

    return (
        <div>
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
            <div className="managers-block">
                {managers.length > 0 ? (
                    <div className="managers-block-list">
                        {managers.map((manager, index) => (
                            <div key={index} className="manager-item">
                                <div>
                                <div><strong>Name:</strong> {manager.name}</div>
                                <div><strong>Surname:</strong> {manager.surname}</div>
                                <div><strong>Email:</strong> {manager.email}</div>
                                <div><strong>Active:</strong> {manager.is_active ? "Yes" : "No"}</div>
                                <div>
                                    <strong>Last login:</strong>{" "}
                                    {manager.last_login
                                        ? new Date(manager.last_login).toLocaleString()
                                        : "Never"}
                                </div>
                                </div>
                                <div className="total"><strong>Total:</strong> 0</div>

                                <div className="manager-buttons">
                                    <button className="activate-btn">ACTIVATE</button>
                                    <button className="ban-btn">BAN</button>
                                    <button className="unban-btn">UNBAN</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No managers found</p>
                )}
            </div>


        </div>
    );
}
