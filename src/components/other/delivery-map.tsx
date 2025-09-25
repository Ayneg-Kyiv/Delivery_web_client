import { useEffect, useRef, useState } from 'react';
import { MapsService } from './google-maps-component';

interface DeliveryMapProps {
  origin?: string;
  destination?: string;
  className?: string;
  onOriginSelect?: (address: string) => void;
  onDestinationSelect?: (address: string) => void;
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ 
  origin, 
  destination, 
  className,
  onOriginSelect,
  onDestinationSelect 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [originMarker, setOriginMarker] = useState<google.maps.Marker | null>(null);
  const [destinationMarker, setDestinationMarker] = useState<google.maps.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectionMode, setSelectionMode] = useState<'origin' | 'destination' | null>(null);
  const mapClickListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  // Initialize map when component mounts - REMOVED selectionMode dependency
  useEffect(() => {
    const initMap = async () => {
      try {
        await MapsService.init();
        
        if (mapRef.current && window.google) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: { lat: 49.0, lng: 31.0 }, // Center on Ukraine
            zoom: 6,
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
            suppressMarkers: true, // We'll use our own markers
            polylineOptions: {
              strokeColor: '#c84cd8',
              strokeWeight: 5,
              strokeOpacity: 0.7,
            }
          });
          
          setMap(mapInstance);
          setDirectionsRenderer(rendererInstance);
        }
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Не вдалося завантажити карту');
      } finally {
        setIsLoading(false);
      }
    };
    
    initMap();
    
    return () => {
      // Clean up code if needed
    };
  }, []); // REMOVED selectionMode from dependency array

  // Separate useEffect for handling click listener
  useEffect(() => {
    if (!map) return;

    // Remove existing listener if any
    if (mapClickListenerRef.current) {
      google.maps.event.removeListener(mapClickListenerRef.current);
      mapClickListenerRef.current = null;
    }

    // Only add click listener if in selection mode
    if (selectionMode) {
      mapClickListenerRef.current = map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          handleMapClick(e.latLng);
        }
      });
    }

    // Cleanup function
    return () => {
      if (mapClickListenerRef.current) {
        google.maps.event.removeListener(mapClickListenerRef.current);
        mapClickListenerRef.current = null;
      }
    };
  }, [map, selectionMode]); // Depend on both map and selectionMode

  // Handle map clicks to place markers and get address
  const handleMapClick = async (latLng: google.maps.LatLng) => {
    if (!map || !selectionMode) return;
    
    const geocoder = new google.maps.Geocoder();
    
    try {
      const response = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ location: latLng.toJSON() }, (results, status) => {
          if (status === 'OK' && results && results.length > 0) {
            resolve(results);
          } else {
            reject(status);
          }
        });
      });
      
      const address = response[0]?.formatted_address || `${latLng.lat().toFixed(6)}, ${latLng.lng().toFixed(6)}`;
      
      // Create or update marker
      if (selectionMode === 'origin') {
        if (originMarker) originMarker.setMap(null);
        
        const newMarker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: 'Початкова точка',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#c84cd8',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
          draggable: true,
        });
        
        newMarker.addListener('dragend', async function() {
          const position = newMarker.getPosition();
          if (position) {
            const result = await reverseGeocode(position);
            if (result && onOriginSelect) {
              onOriginSelect(result);
            }
          }
        });
        
        setOriginMarker(newMarker);
        
        if (onOriginSelect) {
          onOriginSelect(address);
        }
      } else if (selectionMode === 'destination') {
        if (destinationMarker) destinationMarker.setMap(null);
        
        const newMarker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: 'Кінцева точка',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#7f51b3',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
          draggable: true,
        });
        
        newMarker.addListener('dragend', async function() {
          const position = newMarker.getPosition();
          if (position) {
            const result = await reverseGeocode(position);
            if (result && onDestinationSelect) {
              onDestinationSelect(result);
            }
          }
        });
        
        setDestinationMarker(newMarker);
        
        if (onDestinationSelect) {
          onDestinationSelect(address);
        }
      }
      
      // Exit selection mode
      setSelectionMode(null);
    } catch (err) {
      console.error('Error geocoding click position:', err);
      
      // Fallback to coordinates if geocoding fails
      const fallbackAddress = `${latLng.lat().toFixed(6)}, ${latLng.lng().toFixed(6)}`;
      
      // Create marker with coordinates
      if (selectionMode === 'origin') {
        if (originMarker) originMarker.setMap(null);
        
        const newMarker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: 'Початкова точка',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#c84cd8',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
          draggable: true,
        });
        
        setOriginMarker(newMarker);
        
        if (onOriginSelect) {
          onOriginSelect(fallbackAddress);
        }
      } else if (selectionMode === 'destination') {
        if (destinationMarker) destinationMarker.setMap(null);
        
        const newMarker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: 'Кінцева точка',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#7f51b3',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
          draggable: true,
        });
        
        setDestinationMarker(newMarker);
        
        if (onDestinationSelect) {
          onDestinationSelect(fallbackAddress);
        }
      }
      
      // Exit selection mode
      setSelectionMode(null);
    }
  };

  // Reverse geocode (convert coordinates to address)
  const reverseGeocode = async (latLng: google.maps.LatLng): Promise<string | null> => {
    const geocoder = new google.maps.Geocoder();
    
    try {
      const response = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ location: latLng.toJSON() }, (results, status) => {
          if (status === 'OK' && results && results.length > 0) {
            resolve(results);
          } else {
            reject(status);
          }
        });
      });
      
      return response[0]?.formatted_address || `${latLng.lat().toFixed(6)}, ${latLng.lng().toFixed(6)}`;
    } catch (err) {
      console.error('Error reverse geocoding:', err);
      return `${latLng.lat().toFixed(6)}, ${latLng.lng().toFixed(6)}`;
    }
  };

  // Update markers and directions when origin or destination changes
  useEffect(() => {
    const updateMap = async () => {
      if (!map) return;
      
      // Create or update origin marker based on prop
      if (origin) {
        try {
          const originCoords = await MapsService.geocodeAddress(origin);
          if (originCoords && map) {
            if (originMarker) originMarker.setMap(null);
            
            const newMarker = new google.maps.Marker({
              position: originCoords,
              map: map,
              title: 'Початкова точка',
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#c84cd8',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              },
              draggable: true,
            });
            
            newMarker.addListener('dragend', async function() {
              const position = newMarker.getPosition();
              if (position) {
                const result = await reverseGeocode(position);
                if (result && onOriginSelect) {
                  onOriginSelect(result);
                }
              }
            });
            
            setOriginMarker(newMarker);
          }
        } catch (error) {
          console.error('Error setting origin marker:', error);
        }
      }
      
      // Create or update destination marker based on prop
      if (destination) {
        try {
          const destCoords = await MapsService.geocodeAddress(destination);
          if (destCoords && map) {
            if (destinationMarker) destinationMarker.setMap(null);
            
            const newMarker = new google.maps.Marker({
              position: destCoords,
              map: map,
              title: 'Кінцева точка',
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#7f51b3',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              },
              draggable: true,
            });
            
            newMarker.addListener('dragend', async function() {
              const position = newMarker.getPosition();
              if (position) {
                const result = await reverseGeocode(position);
                if (result && onDestinationSelect) {
                  onDestinationSelect(result);
                }
              }
            });
            
            setDestinationMarker(newMarker);
          }
        } catch (error) {
          console.error('Error setting destination marker:', error);
        }
      }
      
      // Update route if both points exist
      if (origin && destination && directionsRenderer) {
        try {
          const directionsService = new google.maps.DirectionsService();
          const result = await directionsService.route({
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
          });
          
          directionsRenderer.setDirections(result);
          
          // Fit bounds to include route
          if (map) {
            const bounds = new google.maps.LatLngBounds();
            if (originMarker && originMarker.getPosition()) {
              bounds.extend(originMarker.getPosition()!);
            }
            if (destinationMarker && destinationMarker.getPosition()) {
              bounds.extend(destinationMarker.getPosition()!);
            }
            map.fitBounds(bounds);
          }
        } catch (err) {
          console.error('Error displaying route:', err);
        }
      }
    };
    
    updateMap();
  }, [map, directionsRenderer, origin, destination]);

  return (
    <div className={`relative ${className || ''}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#241c2d]/50 z-10">
          <div className="w-8 h-8 border-4 border-[#c84cd8] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#241c2d]/50 z-10">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setSelectionMode(prev => prev === 'origin' ? null : 'origin')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${selectionMode === 'origin' 
              ? 'bg-[#c84cd8] text-white' 
              : 'bg-[#241c2d] border border-[#3d2a5a] hover:border-[#c84cd8] text-white'}`}
        >
          {selectionMode === 'origin' ? 'Скасувати' : 'Вказати початок'}
        </button>
        <button
          onClick={() => setSelectionMode(prev => prev === 'destination' ? null : 'destination')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${selectionMode === 'destination' 
              ? 'bg-[#7f51b3] text-white' 
              : 'bg-[#241c2d] border border-[#3d2a5a] hover:border-[#7f51b3] text-white'}`}
        >
          {selectionMode === 'destination' ? 'Скасувати' : 'Вказати кінець'}
        </button>
      </div>
      
      {selectionMode && (
        <div className="absolute top-4 left-4 z-20 bg-[#241c2d]/90 border border-[#3d2a5a] rounded-lg p-3 max-w-[220px]">
          <p className="text-sm text-white">
            {selectionMode === 'origin' 
              ? 'Натисніть на карті, щоб вказати початкову точку' 
              : 'Натисніть на карті, щоб вказати кінцеву точку'}
          </p>
        </div>
      )}
      
      <div 
        ref={mapRef}
        className="w-full h-full min-h-[300px] rounded-xl overflow-hidden"
      ></div>
    </div>
  );
};

export default DeliveryMap;