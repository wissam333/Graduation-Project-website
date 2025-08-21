import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom hook to track location and save to localStorage
function LocationTracker({ setPosition, setLocationName }) {
  useMapEvents({
    moveend: async (e) => {
      const center = e.target.getCenter();
      const lat = center.lat;
      const lng = center.lng;

      setPosition([lat, lng]);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        const locationName = data.display_name || "Unknown location";

        setLocationName(locationName);

        // Save all to localStorage
        localStorage.setItem(
          'user_location',
          JSON.stringify({ lat, lng, name: locationName })
        );
      } catch (err) {
        console.error("Failed to fetch location name", err);
        setLocationName("Failed to fetch location name");
      }
    },
  });
  return null;
}

function Mapp() {
  const [showMap, setShowMap] = useState(false);
  const [position, setPosition] = useState([51.505, -0.09]);
  const [locationName, setLocationName] = useState('');

  const handleOpenMap = () => {
    const [lat, lng] = position;
    localStorage.setItem(
      'user_location',
      JSON.stringify({ lat, lng, name: locationName })
    );
    setShowMap(true);
  };

  const handleCloseMap = () => {
    setShowMap(false);
  };

  return (
    <div>
      {!showMap && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleOpenMap}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#FC4866',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Set Location
          </button>
        </div>
      )}

      {showMap && (
        <div style={{
          position: 'fixed',
          top: '10%',
          left: '10%',
          width: '80%',
          height: '70%',
          background: 'white',
          border: '2px solid #ccc',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <button
            onClick={handleCloseMap}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: '#FC4866',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              zIndex: 1001
            }}
          >
            Close
          </button>

          <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <LocationTracker setPosition={setPosition} setLocationName={setLocationName} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                <strong>{locationName || 'Fetching location name...'}</strong><br />
                Lat: {position[0].toFixed(5)}, Lng: {position[1].toFixed(5)}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default Mapp;
