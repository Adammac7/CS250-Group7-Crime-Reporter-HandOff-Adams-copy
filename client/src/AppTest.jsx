import { useEffect, useRef, useState } from "react";
import "./Styles/App.css";
import MapTest from "./MapTest.jsx";
import CreateReportTest from "./CreateReportTest.jsx";
import Filter from "./Filter.jsx"; // keep original filters
import AuthModal from "./LoginSignUp.jsx";
import { checkAndAlertThreshold, getCreditUsage, recordApiUsage } from "./services/apiCreditTracker.js";

export default function AppTest() {
    const [pinPlacementMode, setPinPlacementMode] = useState(false);
    const [reports, setReports] = useState([]); // all saved reports
    const [activeReport, setActiveReport] = useState(null); // report being created
    const [viewReport, setViewReport] = useState(null); // report being viewed read-only

    // 'Create Report' pop-up
    const [showModal, setShowModal] = useState(false);
    // Login pop-up
    const [authOpen, setAuthOpen] = useState(false);

    // Close on ESC
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") setShowModal(false);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Check API credit status on app load
    useEffect(() => {
        const usage = getCreditUsage();
        checkAndAlertThreshold(usage);
    }, []);

    // Close if clicking the dark backdrop (but not the rectangle itself)
    const backdropRef = useRef(null);
    function onBackdropClick(e) {
        if (e.target === backdropRef.current) setShowModal(false);
    }


    const handleCancelReport = (reportId) => {
        setReports((prev) => prev.filter(r => r.id !== reportId));
        setActiveReport(null);
    }

    // Start creating a new report
    const startCreateReport = () => {
        // Create a temporary report immediately so the modal shows
        const newReport = {
            id: Date.now(),
            position: { lat: 32.7764, lng: -117.0719 }, // Default SDSU position
            formData: null,
        };
        setReports((prev) => [...prev, newReport]);
        setActiveReport(newReport);
        setShowModal(true);
        setPinPlacementMode(false); // Don't require pin placement, modal shows immediately
    };

    // When user clicks map to place a new pin
    const handleMapClick = (position) => {
        if (!pinPlacementMode) return;

        const newReport = {
            id: Date.now(),
            position,
            formData: null,
        };

        setReports((prev) => [...prev, newReport]);
        setActiveReport(newReport); // open modal for this pin
        setPinPlacementMode(false);
    };

    // Save a new report
    const handleSaveReport = (reportId, formData) => {
        setReports((prev) => {
            const updated = prev.map((r) =>
                r.id === reportId ? { ...r, formData } : r
            );
            
            // Find the saved report to log
            const savedReport = updated.find(r => r.id === reportId);
            console.log('Report saved:', savedReport);
            console.log('Report data:', {
                id: savedReport?.id,
                position: savedReport?.position,
                formData: savedReport?.formData
            });
            console.log('Keep report? Y or N');
            
            return updated;
        });
        
        setActiveReport(null); // close modal
        
        // Track API usage for saving report (backend API call)
        // This would typically be tracked in the actual API call, but we'll track it here
        // as a placeholder. In production, track this in the actual fetch/axios call.
        const usage = recordApiUsage(1); // 1 credit for saving a report
        checkAndAlertThreshold(usage);
    };

    // View a saved report
    const handleViewReport = (report) => {
        setViewReport(report);
    };

    return (
        <div className="page">
            <header className="header">
                <div className="schoolLogo"></div>
                <button className="loginBtn" onClick={() => setAuthOpen(true)}>
                    Login
                </button>
            </header>

            <nav className="navBar">
                <div className="card filtersCard">
                    <Filter />
                </div>
                <button className="createBtn" onClick={startCreateReport}>
                    Create Report
                </button>
            </nav>

            {/* Main content with left rail and map */}
            <main className="content">
                <section className="leftCol">
                    <div className="card reportCard">
                        <h2>REPORTS</h2>
                        {reports.filter(r => r.formData).length === 0 && (
                            <p>No saved reports yet. Create a report to see it here.</p>
                        )}
                        {reports.filter(r => r.formData).map((r) => (
                            <div key={r.id} className="reportItem" style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                                <div className="reportField">
                                    <strong>Date of Incident:</strong>
                                    <span>{r.formData.date ? new Date(r.formData.date).toLocaleDateString() : 'N/A'}</span>
                                </div>

                                <div className="reportField">
                                    <strong>Time:</strong>
                                    <span>{r.formData.time ? `${r.formData.time} ${r.formData.ampm || ''}` : 'N/A'}</span>
                                </div>

                                <div className="reportField">
                                    <strong>Type of Incident:</strong>
                                    <span>{r.formData.incidentType && r.formData.incidentType.length > 0 
                                        ? r.formData.incidentType.join(', ') 
                                        : '–'}</span>
                                </div>

                                <div className="reportField">
                                    <strong>Description of Incident:</strong>
                                    <p className="reportDescription">{r.formData.description || 'No description provided.'}</p>
                                </div>

                                <div className="reportField">
                                    <strong>Location:</strong>
                                    <span>{r.position.lat.toFixed(5)}, {r.position.lng.toFixed(5)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mapPanel">
                    <MapTest
                        reports={reports}
                        onMapClick={handleMapClick}
                        onMarkerClick={handleViewReport} // now view only
                    />
                </section>
                {/* Modal for creating/editing a report */}
                {activeReport && (
                    <CreateReportTest
                        report={activeReport}
                        onSave={handleSaveReport}
                        onClose={() => handleCancelReport(activeReport.id)}
                        readOnly={false}
                    />
                )}

                {/* Modal for viewing a saved report */}
                {viewReport && viewReport.formData && (
                    <CreateReportTest
                        report={viewReport}
                        onClose={() => setViewReport(null)}
                        readOnly={true}
                    />
                )}
            </main>
            <AuthModal open={ authOpen } onClose={() => setAuthOpen(false)} />
        </div>
    );
}