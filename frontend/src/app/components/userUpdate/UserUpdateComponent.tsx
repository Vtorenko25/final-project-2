'use client';

import { FC, useState } from 'react';
import { IUser } from "@/app/models/IUser";
import "./user-update-component.css";
import { userService } from "@/app/services/user.service";

interface IUserUpdateComponentProps {
    user: IUser;
    onClose: () => void;
    onUpdateUser?: (updatedUser: IUser) => void;
}

const UserUpdateComponent: FC<IUserUpdateComponentProps> = ({ user, onClose, onUpdateUser }) => {
    const [formData, setFormData] = useState({
        group: user.group || "",
        name: user.name || "",
        surname: user.surname || "",
        email: user.email || "",
        phone: user.phone || "",
        age: user.age?.toString() || "",
        status: user.status || "",
        sum: user.sum?.toString() || "",
        already_paid: user.already_paid?.toString() || "",
        course: user.course || "",
        course_format: user.course_format || "",
        course_type: user.course_type || "",
        manager: user.manager || "",
        utm: user.utm || "",
        msg: user.msg || "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            const dto = {
                ...formData,
                age: formData.age ? Number(formData.age) : undefined,
                sum: formData.sum ? Number(formData.sum) : undefined,
                already_paid: formData.already_paid ? Number(formData.already_paid) : undefined,
            };

            const updatedUser = await userService.updateUserById(user._id, dto);

            console.log("Оновлений user:", updatedUser);

            if (onUpdateUser) onUpdateUser(updatedUser);
        } catch (err: any) {
            console.error("Помилка при оновленні користувача:", err.response?.data || err.message || err);
            alert("Не вдалося оновити користувача. Перевірте консоль.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Редагування користувача</h2>

                <div className="user-form-columns">
                    <div className="column">
                        {["group","name","surname","email","phone","age"].map(field => (
                            <div className="form-group" key={field}>
                                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                <input
                                    value={formData[field as keyof typeof formData]}
                                    onChange={e => handleChange(field as keyof typeof formData, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="column">
                        {["status","sum","already_paid","course","course_format","course_type"].map(field => (
                            <div className="form-group" key={field}>
                                <label>{field.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</label>
                                <input
                                    value={formData[field as keyof typeof formData]}
                                    onChange={e => handleChange(field as keyof typeof formData, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="modal-actions">
                    <button onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                    <button onClick={onClose} disabled={loading}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default UserUpdateComponent;
