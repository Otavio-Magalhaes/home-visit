import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle, HeatmapLayerF, type Libraries } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

const LIBRARIES: Libraries = ['visualization'];

interface MapProps {
  pinos: Array<{ id: string; lat: number; lng: number; titulo: string; }>;
  centerLat: number;
  centerLng: number;
  radiusMeters: number;
  onMapClick: (lat: number, lng: number) => void;
  viewMode: 'markers' | 'heatmap';
}

export const GoogleMapComponent = ({ pinos, centerLat, centerLng, radiusMeters, onMapClick, viewMode }: MapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES 
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedPino, setSelectedPino] = useState<any>(null);

  const onLoad = useCallback((map: google.maps.Map) => setMap(map), []);
  const onUnmount = useCallback(() => setMap(null), []);

  
  const heatmapData = useMemo(() => {
    if (!isLoaded || !window.google || !window.google.maps) return []; 
      
    return pinos.map(p => new window.google.maps.LatLng(p.lat, p.lng));
  }, [pinos, isLoaded]);

  const circleOptions = useMemo(() => ({
    strokeColor: '#003366',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#003366',
    fillOpacity: 0.05,
    clickable: false 
  }), []);

  useEffect(() => {
    if (map) map.panTo({ lat: centerLat, lng: centerLng });
  }, [centerLat, centerLng, map]);

  if (!isLoaded) return <div className="h-full flex items-center justify-center bg-gray-100">Carregando Mapa...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: centerLat, lng: centerLng }}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{ streetViewControl: true, mapTypeControl: true, clickableIcons: false }}
      onClick={(e) => { if (e.latLng) onMapClick(e.latLng.lat(), e.latLng.lng()); }}
    >
      {map && (
        <>
            {/* O Círculo sempre aparece para mostrar a área do filtro */}
            <Circle center={{ lat: centerLat, lng: centerLng }} radius={Number(radiusMeters)} options={circleOptions} />
            
            <Marker 
                position={{ lat: centerLat, lng: centerLng }}
                icon={"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
                title="Centro da Busca"
                zIndex={999}
            />

            {/* LÓGICA DE EXIBIÇÃO: OU PINOS OU HEATMAP */}
            {viewMode === 'markers' ? (
                // MODO PINOS
                pinos.map((pino) => (
                    <Marker
                        key={pino.id}
                        position={{ lat: pino.lat, lng: pino.lng }}
                        title={pino.titulo}
                        onClick={() => setSelectedPino(pino)}
                    />
                ))
            ) : (
                // MODO HEATMAP (HeatmapLayerF é o componente funcional)
                <HeatmapLayerF
                    data={heatmapData}
                    options={{
                        radius: 30, // Tamanho da mancha
                        opacity: 0.6,
                        // Gradiente Opcional (Verde -> Amarelo -> Vermelho)
                        // gradient: ['rgba(0, 255, 255, 0)', 'rgba(0, 255, 255, 1)', 'rgba(0, 191, 255, 1)', 'rgba(0, 127, 255, 1)', 'rgba(0, 63, 255, 1)', 'rgba(0, 0, 255, 1)', 'rgba(0, 0, 223, 1)', 'rgba(0, 0, 191, 1)', 'rgba(0, 0, 159, 1)', 'rgba(0, 0, 127, 1)', 'rgba(63, 0, 91, 1)', 'rgba(127, 0, 63, 1)', 'rgba(191, 0, 31, 1)', 'rgba(255, 0, 0, 1)']
                    }}
                />
            )}
        </>
      )}

      {viewMode === 'markers' && selectedPino && (
        <InfoWindow
          position={{ lat: selectedPino.lat, lng: selectedPino.lng }}
          onCloseClick={() => setSelectedPino(null)}
        >
          <div className="p-2">
            <h3 className="font-bold text-gray-900">{selectedPino.titulo}</h3>
            <p className="text-xs text-gray-500 mt-1">ID: {selectedPino.id}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default GoogleMapComponent;