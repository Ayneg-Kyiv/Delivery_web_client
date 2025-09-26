import React, { useEffect, useRef, useState } from 'react';
import { MapsService } from './google-maps-component';

interface TravelPathMapProps {
  start: { latitude: number; longitude: number };
  end: { latitude: number; longitude: number };
  className?: string;
  mapHeight?: string;
}

const TravelPathMap: React.FC<TravelPathMapProps> = ({ 
  start, 
  end, 
  className,
  mapHeight = '400px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Initialize map when component mounts
  useEffect(() => {
    const initMap = async () => {
      try {
        // Initialize Google Maps API
        await MapsService.init();
        
        if (mapRef.current && window.google) {
          // Calculate center point between start and end
          const centerLat = (start.latitude + end.latitude) / 2;
          const centerLng = (start.longitude + end.longitude) / 2;
          
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: { lat: centerLat, lng: centerLng },
            zoom: 7,
            styles: [
              { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
              {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }],
              },
              {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }],
              },
              {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9ca5b3" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
              },
            ],
          });
          
          const rendererInstance = new google.maps.DirectionsRenderer({
            map: mapInstance,
            suppressMarkers: false, // Show default markers
            polylineOptions: {
              strokeColor: '#c84cd8',
              strokeWeight: 5,
              strokeOpacity: 0.7,
            }
          });
          
          setMap(mapInstance);
          setDirectionsRenderer(rendererInstance);
          
          // Add markers and directions right away
          addMarkersAndDirections(mapInstance, rendererInstance);
        }
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Не вдалося завантажити карту');
      } finally {
        setIsLoading(false);
      }
    };
    
    initMap();
    
  }, []);

  // Add markers and directions
  const addMarkersAndDirections = async (
    mapInstance: google.maps.Map, 
    renderer: google.maps.DirectionsRenderer
  ) => {
    if (!mapInstance || !renderer) return;
    
    try {
      // Validate coordinates
      if (
        start.latitude === null || start.longitude === null || 
        end.latitude === null || end.longitude === null ||
        isNaN(start.latitude) || isNaN(start.longitude) ||
        isNaN(end.latitude) || isNaN(end.longitude)
      ) {
        throw new Error('Invalid coordinates');
      }
      
      // Create origin and destination points
      const origin = new google.maps.LatLng(start.latitude, start.longitude);
      const destination = new google.maps.LatLng(end.latitude, end.longitude);
      
      // Create bounds to fit both points
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(origin);
      bounds.extend(destination);
      
      // Calculate route
      const directionsService = new google.maps.DirectionsService();
      
      try {
        const result = await directionsService.route({
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
          avoidTolls: false,
        });
        
        renderer.setDirections(result);
        mapInstance.fitBounds(bounds);
        
        
      } catch (routeError: any) {
        console.error('Error calculating route:', routeError);
        
        // If we can't get directions, just show markers
        setError('Не вдалося побудувати маршрут між точками');
        
        // Create markers for both points since we couldn't get directions
        new google.maps.Marker({
          position: origin,
          map: mapInstance,
          title: 'Початкова точка',
          animation: google.maps.Animation.DROP,
        });
        
        new google.maps.Marker({
          position: destination,
          map: mapInstance,
          title: 'Кінцева точка',
          animation: google.maps.Animation.DROP,
        });
        
        // Fit map to markers
        mapInstance.fitBounds(bounds);
      }
    } catch (err) {
      console.error('Error in addMarkersAndDirections:', err);
      setError('Помилка відображення карти');
    }
  };

  // Update directions when coordinates change
  useEffect(() => {
    if (map && directionsRenderer) {
      addMarkersAndDirections(map, directionsRenderer);
    }
  }, [map, directionsRenderer, start.latitude, start.longitude, end.latitude, end.longitude]);

  return (
    <div className={`relative ${className || ''}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#241c2d]/50 z-10">
          <div className="w-8 h-8 border-4 border-[#c84cd8] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && !isLoading && (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center z-10">
          <div className="bg-red-500/80 text-white px-4 py-2 rounded text-sm">
            {error}
          </div>
        </div>
      )}
      
      <div 
        ref={mapRef}
        style={{ height: mapHeight }}
        className="w-full rounded-xl overflow-hidden"
      />
    </div>
  );
};

export default TravelPathMap;