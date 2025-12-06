import "./Styles/Maps.css";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
import pinImagePath from "./images/icons8-map-pin-48.png";
import { recordApiUsage, checkAndAlertThreshold } from "./services/apiCreditTracker.js";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAPID;
const center = { lat: 32.7764, lng: -117.0719 };

// Google Maps API credit costs (approximate)
const MAP_LOAD_CREDITS = 1; // Base cost for loading a map
const MARKER_CREDITS = 0.1; // Cost per marker

export default function MapTest({ reports, onMapClick, onMarkerClick }) {
    // Track API usage when component mounts (map loads)
    useEffect(() => {
        // Record map load
        const usage = recordApiUsage(MAP_LOAD_CREDITS);
        checkAndAlertThreshold(usage);
    }, []);

    // Track API usage when markers are added (only count initial render)
    // Note: This is a simplified approach. In production, you'd want to track
    // actual marker additions more precisely to avoid double-counting.
    const prevReportsLength = useRef(0);
    useEffect(() => {
        if (reports.length > prevReportsLength.current) {
            // Only track new markers added
            const newMarkers = reports.length - prevReportsLength.current;
            const markerCredits = newMarkers * MARKER_CREDITS;
            const usage = recordApiUsage(markerCredits);
            checkAndAlertThreshold(usage);
            prevReportsLength.current = reports.length;
        }
    }, [reports.length]);
    const sdsuBounds = {
        north: 32.780,
        south: 32.766,
        west: -117.084,
        east: -117.059,
    };

    const handleClick = (event) => {
        const lat = event.detail.latLng.lat;
        const lng = event.detail.latLng.lng;
        
        // Track API usage for map interaction (click/geocoding)
        const usage = recordApiUsage(0.1); // Small credit cost for map interaction
        checkAndAlertThreshold(usage);
        
        onMapClick({ lat, lng });
    };

    return (
        <APIProvider apiKey={apiKey} libraries={["marker"]} mapId={mapId}>
            <Map
                defaultCenter={center}
                defaultZoom={16}
                style={{ width: '100%', height: '100%', borderRadius: 15 }}
                options={{
                    mapId: mapId,
                    restriction: {
                        latLngBounds: sdsuBounds,
                        strictBounds: true,
                    },
                    zoomControl: true,
                    mapTypeControl: true,
                    streetViewControl: true,
                    fullscreenControl: true,
                    scaleControl: true
                }}
                onClick={handleClick}
            >
                {reports.map((r) => (
                    <AdvancedMarker
                        key={r.id}
                        position={r.position}
                        onClick={() => r.formData && onMarkerClick(r)} // only view saved reports
                    >
                        <Pin background="transparent" borderColor="transparent">
                            <img
                                src={pinImagePath}
                                style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                            />
                        </Pin>
                    </AdvancedMarker>
                ))}
            </Map>
        </APIProvider>
    );
}
