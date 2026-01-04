'use client';

import { useEffect, useState } from 'react';
import './admin-component.css';
import { managerService } from "@/app/services/manager.service";
import { userService } from "@/app/services/user.service";
import { IFormData } from "@/app/models/IFormData";
import { IStatistic } from "@/app/models/IStatistic";
import { IManager, IManagerCreate } from "@/app/models/IManager";
import { passwordService } from "@/app/services/password.service";

export default function AdminComponent() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<IFormData>({ email: '', name: '', surname: '' });
    const [stats, setStats] = useState<IStatistic>({ total: 0, agree: 0, inWork: 0, disagree: 0, dubbing: 0, new: 0 });
    const [managers, setManagers] = useState<IManager[]>([]);
    const [buttonState, setButtonState] = useState<Record<number, "activate" | "recovery" | "copy">>({});
    const [copyMessage, setCopyMessage] = useState<Record<number, boolean>>({});
    const [managerStats, setManagerStats] = useState<Record<string, IStatistic>>({});


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const managerDto: IManagerCreate = {
                email: formData.email!,
                name: formData.name!,
                surname: formData.surname!,
                is_active: "true",
                last_login: ""
            };
            await managerService.createManager(managerDto);
            setFormData({ email: '', name: '', surname: '' });
            setShowForm(false);
            fetchManagers(1);
        } catch (error) {
            console.error('Помилка створення менеджера:', error);
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


    const fetchManagers = async (page: number) => {
        try {
            const res = await managerService.getAllManagers(page);
            const managersList: IManager[] = (res.data ?? []).map((m: IManager) => ({
                email: m.email,
                name: m.name,
                surname: m.surname,
                last_login: m.last_login ?? "",
                manager_id: m.manager_id,
                is_active: String(m.is_active)
            }));

            managersList.sort((a, b) => b.manager_id - a.manager_id);
            setManagers(managersList);

            const initialState: Record<number, "activate" | "recovery" | "copy"> = {};
            managersList.forEach(m => {
                initialState[m.manager_id] = m.is_active === "true" ? "recovery" : "activate";
            });
            setButtonState(initialState);
        } catch (err) {
            console.error('Помилка при завантаженні менеджерів:', err);
        }
    };


    const fetchManagerStats = async (email: string) => {
        try {
            const data = await userService.getManagerStatistic(email);
            if (data.total || data.agree || data.inWork || data.disagree || data.dubbing || data.new) {
                setManagerStats(prev => ({ ...prev, [email]: data }));
            } else {
                setManagerStats(prev => {
                    const copy = { ...prev };
                    delete copy[email];
                    return copy;
                });
            }
        } catch (err) {
            console.error(`Помилка при завантаженні статистики менеджера ${email}:`, err);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchManagers(1);
    }, []);

    const handleActivate = async (id: number, email: string) => {
        try {
            const res = await passwordService.createPassword(id);
            const token = res.AccessToken;
            const link = `http://localhost:3000/activate?token=${token}&manager_id=${id}`;
            await navigator.clipboard.writeText(link);
            setButtonState(prev => ({ ...prev, [id]: "recovery" }));
            fetchManagerStats(email);
        } catch (err) {
            console.error(err);
            alert("Не вдалося створити посилання для активації.");
        }
    };

    const handleCopy = async (id: number, email: string) => {
        const res = await passwordService.createPassword(id);
        const token = res.AccessToken;
        const link = `http://localhost:3000/activate?token=${token}&manager_id=${id}`;
        await navigator.clipboard.writeText(link);

        setCopyMessage(prev => ({ ...prev, [id]: true }));
        setTimeout(() => setCopyMessage(prev => ({ ...prev, [id]: false })), 5000);

        await managerService.updateLastLogin(id);
        fetchManagerStats(email);
    };

    const handleRecovery = (id: number) => {
        setButtonState(prev => ({ ...prev, [id]: "copy" }));
    };

    const handleBan = async (id: number) => {
        try {
            await managerService.banManager(id);
            fetchManagers(1);
        } catch (err) {
            console.error(err);
            alert("Не вдалося заблокувати менеджера.");
        }
    };

    const handleUnban = async (id: number) => {
        try {
            await managerService.unbanManager(id);
            fetchManagers(1);
        } catch (err) {
            console.error(err);
            alert("Не вдалося розблокувати менеджера.");
        }
    };

    return (
        <div>
            <div className="admin-component">
                <button className="button-create" onClick={() => setShowForm(true)}>CREATE</button>

                {showForm && (
                    <div className="form-overlay">
                        <form className="manager-form" onSubmit={handleCreate}>
                            <label>Email:</label>
                            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                            <label>Name:</label>
                            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                            <label>Surname:</label>
                            <input type="text" name="surname" placeholder="Surname" value={formData.surname} onChange={handleChange} required />
                            <div className="buttons">
                                <button type="button" className="cancel" onClick={handleCancel}>CANCEL</button>
                                <button type="submit" className="create">CREATE</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="stats-block">
                    <h3 className="stats-block-h3">Orders statistic</h3>
                    <div className="stats-block-div">
                        <span><strong>Total:</strong> {stats.total}</span>
                        <span><strong>Agree:</strong> {stats.agree}</span>
                        <span><strong>In work:</strong> {stats.inWork}</span>
                        <span><strong>Disagree:</strong> {stats.disagree}</span>
                        <span><strong>Dubbing:</strong> {stats.dubbing}</span>
                        <span><strong>New:</strong> {stats.new}</span>
                    </div>
                </div>
            </div>

            <div className="managers-block">
                {managers.length > 0 ? managers.map(manager => (
                    <div key={manager.manager_id} className="manager-item">
                        <div className="manager-info">
                            <div><strong>Id:</strong> {manager.manager_id}</div>
                            <div><strong>Email:</strong> {manager.email}</div>
                            <div><strong>Name:</strong> {manager.name}</div>
                            <div><strong>Surname:</strong> {manager.surname}</div>
                            <div><strong>Active:</strong> {manager.is_active}</div>
                            <div><strong>Last login:</strong> {manager.last_login ? new Date(manager.last_login).toLocaleDateString() : "null"}</div>
                        </div>

                        {managerStats[manager.email] && (
                            <div className="stats-block-manager-stats">
                                <ul>
                                    {Object.entries(managerStats[manager.email]).map(([key, value]) => value > 0 && <li key={key}><strong>{key}:</strong> {value}</li>)}
                                </ul>
                            </div>
                        )}

                        <div className="manager-buttons">
                            {buttonState[manager.manager_id] === "activate" &&
                                <button className="activate-btn" onClick={() => handleActivate(manager.manager_id, manager.email)}>ACTIVATE</button>
                            }
                            {buttonState[manager.manager_id] === "recovery" &&
                                <button className="activate-btn" onClick={() => handleRecovery(manager.manager_id)}>RECOVERY PASSWORD</button>
                            }
                            {buttonState[manager.manager_id] === "copy" &&
                                <button className="activate-btn" onClick={() => handleCopy(manager.manager_id, manager.email)}>COPY TO CLIPBOARD</button>
                            }
                            <button className="ban-btn" onClick={() => handleBan(manager.manager_id)}>BAN</button>
                            <button className="unban-btn" onClick={() => handleUnban(manager.manager_id)}>UNBAN</button>
                        </div>

                        {copyMessage[manager.manager_id] && <div className="copyMessage">Link copied to clipboard</div>}
                    </div>
                )) : <p>No managers found</p>}
            </div>
        </div>
    );
}
