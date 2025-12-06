import "./Styles/Modal.css";
import "./Styles/ReportCard.css";
import React, { useState } from 'react';

function Report({ showModal, setShowModal, backdropRef, onBackdropClick }) {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        ampm: 'AM',
        yourAge: '',
        yourGender: '',
        personName: '',
        personAge: '',
        personGender: '',
        incidentType: [],
        description: '',
        email: ''
    });

    const handleInputChange = (e) => {
        const { id, name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                incidentType: checked 
                    ? [...prev.incidentType, value]
                    : prev.incidentType.filter(item => item !== value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [id || name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Report submitted:', formData);
        // TODO: Send formData to backend API
        // Example: fetch('/api/reports', { method: 'POST', body: JSON.stringify(formData) })
        setShowModal(false);
    };

    if (!showModal) return null;

    console.log('Report modal rendering, showModal:', showModal);

    return (
        <div
            className="modalBackdrop"
            ref={backdropRef}
            onMouseDown={(e) => {
                if (e.target === backdropRef.current) {
                    onBackdropClick(e);
                }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cr-title"
        >
            <div 
                className="modalCard"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="modalHeader">
                    <h2 id="cr-title">Create Report</h2>
                    <button
                        className="modalClose"
                        onClick={() => setShowModal(false)}
                        aria-label="Close"
                    >
                        ✖
                    </button>
                </div>

                <div className="modalBody">
                    <form className="formGrid" onSubmit={handleSubmit}>
                        {/* Date & Time */}
                        <div className="field">
                            <label htmlFor="date">Date of incident</label>
                            <input id="date" type="date" className="input" value={formData.date} onChange={handleInputChange} />
                        </div>

                        <div className="field">
                            <label htmlFor="time">Time</label>
                            <div className="timeRow">
                                <input id="time" type="time" className="input" value={formData.time} onChange={handleInputChange} />
                                <div className="segmented" role="radiogroup" aria-label="AM or PM">
                                    <label className="segmentedItem">
                                        <input type="radio" name="ampm" value="AM" checked={formData.ampm === 'AM'} onChange={handleInputChange} />
                                        <span>AM</span>
                                    </label>
                                    <label className="segmentedItem">
                                        <input type="radio" name="ampm" value="PM" checked={formData.ampm === 'PM'} onChange={handleInputChange} />
                                        <span>PM</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Your info */}
                        <div className="field">
                            <label htmlFor="yourAge">Your Age</label>
                            <input id="yourAge" type="number" min="0" placeholder="e.g., 21" className="input" value={formData.yourAge} onChange={handleInputChange} />
                        </div>

                        <div className="field">
                            <label htmlFor="yourGender">Your Gender</label>
                            <select id="yourGender" value={formData.yourGender} onChange={handleInputChange} className="input">
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
                            <label htmlFor="personName">name</label>
                            <input id="personName" type="text" placeholder="(optional)" className="input" value={formData.personName} onChange={handleInputChange} />
                        </div>

                        <div className="field">
                            <label htmlFor="personAge">Age</label>
                            <input id="personAge" type="number" min="0" placeholder="e.g., 22" className="input" value={formData.personAge} onChange={handleInputChange} />
                        </div>

                        <div className="field">
                            <label htmlFor="personGender">Gender</label>
                            <select id="personGender" value={formData.personGender} onChange={handleInputChange} className="input">
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
                                <label className="check"><input type="checkbox" value="Theft" onChange={handleInputChange} /> <span>Theft</span></label>
                                <label className="check"><input type="checkbox" value="Vandalism" onChange={handleInputChange} /> <span>Vandalism</span></label>
                                <label className="check"><input type="checkbox" value="Assault" onChange={handleInputChange} /> <span>Assault</span></label>
                                <label className="check"><input type="checkbox" value="Disturbance" onChange={handleInputChange} /> <span>Disturbance</span></label>
                                <label className="check"><input type="checkbox" value="Other" onChange={handleInputChange} /> <span>Other</span></label>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="field full">
                            <label htmlFor="description">Description of Incident</label>
                            <textarea id="description" name="description" rows="5" placeholder="Describe what happened…" className="input textarea" value={formData.description} onChange={handleInputChange} />
                        </div>

                        <div className="field">
                            <label htmlFor="email" style={{ fontWeight: '600', display: 'block', marginBottom: '8px', color: '#fff' }}>Email</label>
                            <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="input" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}/>
                        </div>

                        {/* Actions */}
                        <div className="actions full">
                            <button
                                type="button"
                                className="btn secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn primary">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Report;
