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
    const [formData, setFormData] = useState<IFormData>({
        email: '',
        name: '',
        surname: ''
    });
    const [stats, setStats] = useState<IStatistic>({
        total: 0, agree: 0, inWork: 0, disagree: 0, dubbing: 0, new: 0
    });
    const [managers, setManagers] = useState<IManager[]>([]);
    const [buttonState, setButtonState] = useState<Record<number, "activate" | "recovery" | "copy">>({});
    const [copyMessage, setCopyMessage] = useState<Record<number, boolean>>({});

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
                is_active: formData.is_active ?? "true",
                last_login: formData.last_login ?? ""
            };
            await managerService.createManager(managerDto);
            setFormData({ email: '', name: '', surname: '' });
            setShowForm(false);
            fetchManager(1);
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

    useEffect(() => {
        fetchStats();
        fetchManager(1);
    }, []);

    const handleActivate = async (id: number) => {
        try {
            const res = await passwordService.createPassword(id);
            const token = res.AccessToken;
            const activationLink = `http://localhost:3000/activate?token=${token}&manager_id=${id}`;
            await navigator.clipboard.writeText(activationLink);

            console.log("Activation link:", activationLink);

            setButtonState(prev => ({ ...prev, [id]: "recovery" }));
        } catch (e) {
            console.error("Помилка при створенні посилання:", e);
            alert("Не вдалося створити посилання для активації.");
        }
    };

    const handleCopy = async (id: number) => {
        const res = await passwordService.createPassword(id);
        const token = res.AccessToken;
        const activationLink = `http://localhost:3000/activate?token=${token}&manager_id=${id}`;
        navigator.clipboard.writeText(activationLink);

        setCopyMessage(prev => ({ ...prev, [id]: true }));

        setTimeout(() => {
            setCopyMessage(prev => ({ ...prev, [id]: false }));
        }, 5000);
        await managerService.updateLastLogin(id);
        fetchManager(1);
    };

    const handleRecovery = (id: number) => {
        setButtonState(prev => ({ ...prev, [id]: "copy" }));
    };
    const handleBan = async (id: number) => {
        try {
            await managerService.banManager(id);
            fetchManager(1);
        } catch (err) {
            console.error("Помилка при бані менеджера:", err);
            alert("Не вдалося заблокувати менеджера.");
        }
    };

    const handleUnban = async (id: number) => {
        try {
            await managerService.unbanManager(id);
            fetchManager(1);
        } catch (err) {
            console.error("Помилка при розбані менеджера:", err);
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
                            <input type="email" name="email" placeholder="Email"
                                   value={formData.email} onChange={handleChange} required />
                            <label>Name:</label>
                            <input type="text" name="name" placeholder="Name"
                                   value={formData.name} onChange={handleChange} required />
                            <label>Surname:</label>
                            <input type="text" name="surname" placeholder="Surname"
                                   value={formData.surname} onChange={handleChange} required />
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
                        {managers.map(manager => (
                            <div key={manager.manager_id} className="manager-item">
                                <div className="manager-info">
                                    <div><strong>ID:</strong> {manager.manager_id}</div>
                                    <div><strong>Name:</strong> {manager.name}</div>
                                    <div><strong>Surname:</strong> {manager.surname}</div>
                                    <div><strong>Email:</strong> {manager.email}</div>
                                    <div><strong>Active:</strong> {manager.is_active}</div>
                                    <div><strong>Last login:</strong> {manager.last_login ? new Date(manager.last_login).toLocaleString() : "null"}</div>
                                </div>

                                <div className="manager-buttons">
                                    {buttonState[manager.manager_id] === "activate" && (
                                        <button className="activate-btn"
                                                onClick={() => handleActivate(manager.manager_id)}>
                                            ACTIVATE
                                        </button>
                                    )}
                                    {buttonState[manager.manager_id] === "recovery" && (
                                        <button className="activate-btn"
                                                onClick={() => handleRecovery(manager.manager_id)}>
                                            RECOVERY PASSWORD
                                        </button>
                                    )}
                                    {buttonState[manager.manager_id] === "copy" && (
                                        <button className="activate-btn" onClick={() => handleCopy(manager.manager_id)}>
                                            COPY TO CLIPBOARD
                                        </button>
                                    )}
                                    <button className="ban-btn" onClick={() => handleBan(manager.manager_id)}>BAN
                                    </button>
                                    <button className="unban-btn"
                                            onClick={() => handleUnban(manager.manager_id)}>UNBAN
                                    </button>

                                </div>
                                {copyMessage[manager.manager_id] && (
                                    <div className="copyMessage">
                                        Link copied to clipboard
                                    </div>
                                )}

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

