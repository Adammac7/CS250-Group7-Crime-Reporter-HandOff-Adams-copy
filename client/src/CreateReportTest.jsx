import "./Styles/Modal.css";
import "./Styles/ReportCard.css";
import React, { useState, useEffect } from "react";
const date = { today: new Date().toISOString().split("T")[0] };
const minDate = new Date(Date.now() - 365*24*60*60*1000).toISOString().split("T")[0]; // 1 year ago



function checkDateInRange(selectedDate) {
         // validate date range
        if (!selectedDate) {
        alert(`⚠️ Please select a date between ${minDate} and ${date.today}.`);
        return false;
    }
    if (selectedDate < minDate || selectedDate > date.today) {
        alert(`⚠️ Date must be between ${minDate} and ${date.today}.`);
        return false;
    }
    return true;
}
function CreateReportTest({ report, onSave, onClose, readOnly }) {
    const [formData, setFormData] = useState(report.formData || {
        date: date.today,  // starts with today for convenience and forces the date range input to not start at min( a year ago )
        time: "",
        ampm: "AM",
        yourAge: "",
        yourGender: "",
        personName: "",
        personAge: "",
        personGender: "",
        incidentType: [],
        description: ""
    });


    useEffect(() => {
        if (report.formData) setFormData(report.formData);
    }, [report]);

    const handleChange = (e) => {
        if (readOnly) return; // prevent editing in read-only mode
        const { id, value, type } = e.target;

        if (type === "checkbox") {
            const val = e.target.value;
            setFormData(prev => {
                const types = prev.incidentType.includes(val)
                    ? prev.incidentType.filter(v => v !== val)
                    : [...prev.incidentType, val];
                return { ...prev, incidentType: types };
            });
        } else if (type === "radio") {
            setFormData(prev => ({ ...prev, ampm: value }));
        } else {
            // covers text, number, and textarea fields
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleSave = () => {
        const emailInput = document.getElementById('email');
        const email = emailInput ? emailInput.value : '';
        if (email && !email.includes('@sdsu.edu')) {
            alert("Please enter a valid SDSU email (@sdsu.edu)");
            return;
        }
        if (!checkDateInRange(formData.date)) return;
        if (readOnly) return;

        const requiredFields = [
            "date",
            "time",
            "yourAge",
            "yourGender",
            "personAge",
            "personGender",
            "description",
        ];

        const emptyField = requiredFields.find(field=>!formData[field] || formData[field].trim() === "");
        const noIncidentType = formData.incidentType.length === 0;

        if (emptyField || noIncidentType) {
            alert("⚠️Please fill in all required fields and select at least one incident type before saving.");
            return;
        }

        onSave(report.id, formData);
    };

    return (
        <div 
            className="modalBackdrop" 
            role="dialog" 
            aria-modal="true"
            onClick={(e) => {
                if (e.target.classList.contains('modalBackdrop')) {
                    onClose();
                }
            }}
        >
            <div 
                className="modalCard"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="modalHeader">
                    <h2 id="cr-title">{readOnly ? "Report Details" : "Create Report"}</h2>
                    <button
                        className="modalClose"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✖
                    </button>
                </div>

                <div className="modalBody">
                    <form className="formGrid" onSubmit={(e) => e.preventDefault()}>

                        {/* Date & Time */}
                        <div className="field">
                            <label htmlFor="date">Date of incident</label>
                            <input
                                id="date"
                                type="date"
                                className="input"
                                min={minDate}
                                max={date.today}
                                value={formData.date}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="time">Time</label>
                            <div className="timeRow">
                                <input
                                    id="time"
                                    type="time"
                                    className="input"
                                    value={formData.time}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                />
                                <div className="segmented" role="radiogroup" aria-label="AM or PM">
                                    {["AM","PM"].map(v => (
                                        <label key={v} className="segmentedItem">
                                            <input
                                                type="radio"
                                                name="ampm"
                                                value={v}
                                                checked={formData.ampm === v}
                                                onChange={handleChange}
                                                disabled={readOnly}
                                            />
                                            <span>{v}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Your info */}
                        <div className="field">
                            <label htmlFor="yourAge">Your Age</label>
                            <input
                                id="yourAge"
                                type="number"
                                min="0"
                                placeholder="e.g., 21"
                                className="input"
                                value={formData.yourAge}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="yourGender">Your Gender</label>
                            <select
                                id="yourGender"
                                value={formData.yourGender}
                                className="input"
                                onChange={handleChange}
                                disabled={readOnly}
                            >
                                <option value="" disabled>Select…</option>
                                <option>M</option>
                                <option>F</option>
                                <option>Prefer not to say</option>
                                <option>Other</option>
                            </select>
                        </div>

                        {/* Person involved */}
                        <div className="fieldsetTitle full">Person Involved</div>

                        <div className="field">
                            <label htmlFor="personName">Name</label>
                            <input
                                id="personName"
                                type="text"
                                placeholder="(optional)"
                                className="input"
                                value={formData.personName}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="personAge">Age</label>
                            <input
                                id="personAge"
                                type="number"
                                min="0"
                                placeholder="e.g., 22"
                                className="input"
                                value={formData.personAge}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="personGender">Gender</label>
                            <select
                                id="personGender"
                                value={formData.personGender}
                                className="input"
                                onChange={handleChange}
                                disabled={readOnly}
                            >
                                <option value="" disabled>Select…</option>
                                <option>M</option>
                                <option>F</option>
                                <option>Prefer not to say</option>
                                <option>Other</option>
                            </select>
                        </div>

                        {/* Incident type */}
                        <div className="field full">
                            <label>Type of Incident</label>
                            <div className="checksRow">
                                {["Theft","Vandalism","Assault","Disturbance","Other"].map(v => (
                                    <label key={v} className="check">
                                        <input
                                            type="checkbox"
                                            value={v}
                                            checked={formData.incidentType.includes(v)}
                                            onChange={handleChange}
                                            disabled={readOnly}
                                        />
                                        <span>{v}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="field full">
                            <label htmlFor="description">Description of Incident</label>
                            <textarea
                                id="description"
                                rows="5"
                                placeholder="Describe what happened…"
                                className="input textarea"
                                value={formData.description}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="email" style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#fff' }}>Email</label>
                            <input id="email" name="email" type="email" defaultValue="" className="input" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}/>
                        </div>

                        {/* Actions */}
                        {!readOnly && (
                            <div className="actions full">
                                <button
                                    type="button"
                                    className="btn secondary"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="btn primary"
                                    onClick={handleSave}
                                >

                                    Save
                                </button>
                            </div>
                        )}

                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateReportTest;
