
'use client';

import { FC, useEffect, useState } from 'react';
import "./user-update-component.css";
import { userService } from "@/app/services/user.service";
import { courseFormatOptions, courseOptions, courseTypeOptions, statusOptions } from "@/app/constans/course.columns";
import { IUserUpdateComponentProps } from "@/app/models/IUserUpdateComponentProps";

const UserUpdateComponent: FC<IUserUpdateComponentProps> = ({ user, onClose, onUpdateUser }) => {
    const [formData, setFormData] = useState({
        group: user.group || "",
        name: user.name || "",
        surname: user.surname || "",
        email: user.email || "",
        phone: user.phone || "",
        age: user.age?.toString() || "",
        status: user.status || statusOptions[0],
        sum: user.sum?.toString() || "",
        already_paid: user.already_paid?.toString() || "",
        course: user.course || courseOptions[0],
        course_format: user.course_format || courseFormatOptions[0],
        course_type: user.course_type || courseTypeOptions[0],
        manager: user.manager || "",
        utm: user.utm || "",
        msg: user.msg || "",
    });

    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState<string[]>([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setGroups(["Group A", "Group B", "Group C"]);
            } catch (err) {
                console.error("Не вдалося завантажити групи:", err);
            }
        };
        fetchGroups();
    }, []);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddGroup = async () => {
        const groupName = formData.group.trim();
        if (!groupName) return;

        try {
            const updatedUser = await userService.updateUserById(user._id, { group: groupName });
            setFormData(prev => ({ ...prev, group: updatedUser.group }));
            if (onUpdateUser) onUpdateUser(updatedUser);
        } catch (err) {
            console.error("Помилка при додаванні групи:", err);
        }
    };

    const handleSelectGroup = () => {
        if (groups.length === 0) {
            alert("Немає доступних груп");
            return;
        }
        const selectedGroup = groups[0];
        setFormData(prev => ({ ...prev, group: selectedGroup }));
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
            setFormData({
                ...updatedUser,
                age: updatedUser.age?.toString() || "",
                sum: updatedUser.sum?.toString() || "",
                already_paid: updatedUser.already_paid?.toString() || "",
            });
            if (onUpdateUser) onUpdateUser(updatedUser);
            onClose();
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
                <div className="user-form-columns">
                    <div className="column">
                        {["group","name","surname","email","phone","age"].map(field => (
                            <div className="form-group" key={field}>
                                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                <input
                                    value={formData[field as keyof typeof formData]}
                                    onChange={e => handleChange(field as keyof typeof formData, e.target.value)}
                                />
                                {field === "group" && (
                                    <div className="group-buttons">
                                        <button type="button" onClick={handleAddGroup}>ADD</button>
                                        <button type="button" onClick={handleSelectGroup}>SELECT</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="column">
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                value={formData.status}
                                onChange={e => handleChange("status", e.target.value)}
                            >
                                {statusOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Course</label>
                            <select
                                value={formData.course}
                                onChange={e => handleChange("course", e.target.value)}
                            >
                                {courseOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Course Format</label>
                            <select
                                value={formData.course_format}
                                onChange={e => handleChange("course_format", e.target.value)}
                            >
                                {courseFormatOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Course Type</label>
                            <select
                                value={formData.course_type}
                                onChange={e => handleChange("course_type", e.target.value)}
                            >
                                {courseTypeOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Sum</label>
                            <input
                                value={formData.sum}
                                onChange={e => handleChange("sum", e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Already Paid</label>
                            <input
                                value={formData.already_paid}
                                onChange={e => handleChange("already_paid", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button onClick={onClose} disabled={loading}>CLOSE</button>
                    <button onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "SUBMIT"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserUpdateComponent;
