import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const defaultCenter = {
  lat: 28.6139, // Delhi default
  lng: 77.2090,
};

const LocationPicker = ({ lat, lng, setLat, setLng }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <p>Loading map...</p>;

  const handleClick = (e) => {
    setLat(e.latLng.lat());
    setLng(e.latLng.lng());
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={lat && lng ? { lat, lng } : defaultCenter}
      zoom={14}
      onClick={handleClick}
    >
      {lat && lng && (
        <Marker
          position={{ lat, lng }}
          draggable
          onDragEnd={handleClick}
        />
      )}
    </GoogleMap>
  );
};

export default LocationPicker;
