'use client';

import { FC, useEffect, useState } from 'react';
import "./user-update-component.css";
import { userService } from "@/app/services/user.service";
import {
    courseFormatOptions,
    courseOptions,
    courseTypeOptions,
    statusOptions
} from "@/app/constans/course.columns";
import { IUserUpdateComponentProps } from "@/app/models/IUserUpdateComponentProps";
import { getCurrentManagerEmail } from "@/app/helpers/role";
import { groupService } from "@/app/services/group.service";

const UserUpdateComponent: FC<IUserUpdateComponentProps> = ({
                                                                user,
                                                                onClose,
                                                                onUpdateUser
                                                            }) => {

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
    const [showGroups, setShowGroups] = useState(false);
    const [ageError, setAgeError] = useState('');

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await groupService.getAllGroups();

                const normalized = data.map((g: any) =>
                    typeof g === "string" ? g : g.name
                );

                setGroups(normalized);
            } catch (err) {
                console.error("Не вдалося завантажити групи:", err);
            }
        };

        fetchGroups();
    }, []);

    const handleChange = (field: keyof typeof formData, value: string) => {

        if (field === "age") {
            const num = Number(value);

            if (value !== "" && num < 10) {
                setAgeError("Age must be at least 10");
            } else {
                setAgeError("");
            }
        }

        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddGroup = async () => {
        const name = formData.group.trim();
        if (!name) return;

        try {
            await groupService.assignGroupToUser(user._id, name);

            const updated = await groupService.getAllGroups();
            const normalized = updated.map((g: any) =>
                typeof g === "string" ? g : g.name
            );

            setGroups(normalized);

        } catch (err) {
            console.error("Error assigning group:", err);
        }
    };
    const handleSave = async () => {
        if (formData.age && Number(formData.age) < 10) {
            setAgeError("Age must be at least 10");
            return;
        }

        try {
            setLoading(true);

            const dto = {
                ...formData,
                status: "In Work",
                manager: formData.manager || getCurrentManagerEmail(),
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

            onUpdateUser?.(updatedUser);
            onClose();

        } catch (err) {
            console.error("Update error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="user-form-columns">
                    <div className="column">
                        <div className="form-group">
                            <label>Group</label>
                            <input
                                value={formData.group}
                                onChange={e => handleChange("group", e.target.value)}
                                placeholder="Select or type group"
                            />

                            <div className="group-buttons">
                                <button
                                    type="button"
                                    onClick={() => setShowGroups(prev => !prev)}
                                >
                                    SELECT
                                </button>

                                <button
                                    type="button"
                                    onClick={handleAddGroup}
                                >
                                    ADD
                                </button>
                            </div>

                            {showGroups && (
                                <div
                                    className="dropdown"
                                    onClick={e => e.stopPropagation()}
                                >
                                    {groups.length === 0 ? (
                                        <div>No groups</div>
                                    ) : (
                                        groups.map((g, i) => (
                                            <div
                                                key={i}
                                                className="dropdown-item"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        group: g
                                                    }));
                                                    setShowGroups(false);
                                                }}
                                            >
                                                {g}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {["name", "surname", "email", "phone"].map(field => (
                            <div className="form-group" key={field}>
                                <label>{field}</label>
                                <input
                                    value={formData[field as keyof typeof formData]}
                                    onChange={e => handleChange(field as any, e.target.value)}
                                />
                            </div>
                        ))}

                        <div className="form-group">
                            <label>Age</label>
                            <input
                                type="number"
                                value={formData.age}
                                onChange={e => handleChange("age", e.target.value)}
                            />
                            {ageError && <p className="error">{ageError}</p>}
                        </div>

                    </div>
                    <div className="column">

                        <div className="form-group">
                            <label>Status</label>
                            <select disabled value={formData.status}>
                                <option>In Work</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Course</label>
                            <select
                                value={formData.course}
                                onChange={e => handleChange("course", e.target.value)}
                            >
                                {courseOptions.map(o => (
                                    <option key={o} value={o}>{o}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Format</label>
                            <select
                                value={formData.course_format}
                                onChange={e => handleChange("course_format", e.target.value)}
                            >
                                {courseFormatOptions.map(o => (
                                    <option key={o} value={o}>{o}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Type</label>
                            <select
                                value={formData.course_type}
                                onChange={e => handleChange("course_type", e.target.value)}
                            >
                                {courseTypeOptions.map(o => (
                                    <option key={o} value={o}>{o}</option>
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
                    <button onClick={onClose} disabled={loading}>
                        CLOSE
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={loading || !!ageError}
                    >
                        {loading ? "Saving..." : "SUBMIT"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default UserUpdateComponent;

