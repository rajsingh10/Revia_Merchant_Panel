import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { PrimaryButton } from './Badges';

// Fix Leaflet's default icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (address: string) => void;
  searchQuery?: string;
}

const MapUpdater: React.FC<{ center: L.LatLngExpression }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

const LocationMarker: React.FC<{ position: L.LatLng | null; setPosition: (pos: L.LatLng) => void }> = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

export const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, onSelectLocation, searchQuery }) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [loading, setLoading] = useState(false);
  const [center, setCenter] = useState<L.LatLngTuple>([37.794, -122.404]);

  useEffect(() => {
    if (isOpen && searchQuery && searchQuery.trim().length > 0) {
      const fetchCoords = async () => {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
          const data = await response.json();
          if (data && data.length > 0) {
            setCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          }
        } catch (error) {
          console.error("Geocoding failed", error);
        }
      };
      fetchCoords();
    }
  }, [isOpen, searchQuery]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!position) return;
    setLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`);
      const data = await response.json();
      const address = data.display_name || `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`;
      onSelectLocation(address);
    } catch (error) {
      console.error('Error fetching address:', error);
      onSelectLocation(`${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-[#E5E0D8] flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-[#1A1615]">Select Location</h3>
            <p className="text-xs text-[#6E6A66] mt-1">Click on the map to place a pin at your flagship outlet.</p>
          </div>
          <button onClick={onClose} className="text-[#6E6A66] hover:text-[#1A1615] font-bold text-xl cursor-pointer">&times;</button>
        </div>
        <div className="h-[400px] w-full relative z-0">
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={center} />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>
        <div className="p-4 border-t border-[#E5E0D8] flex justify-end gap-3 bg-[#FAF8F5]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#6E6A66] border border-[#E5E0D8] hover:bg-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <PrimaryButton onClick={handleConfirm} disabled={!position || loading}>
            {loading ? 'Fetching Address...' : 'Confirm Location'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
