import { useEffect, useRef, useState } from 'react';
import { MapsService } from './google-maps-component';
import { useI18n } from '@/i18n/I18nProvider';

// Import LocationState type
interface LocationState {
  country: string;
  state: string;
  city: string;
  address: string;
  houseNumber: string;
  date: string;
  time: string;
  dateTime: string;
  latitude: number | null;
  longitude: number | null;
}

interface DeliveryMapProps {
  startLocation?: LocationState;
  endLocation?: LocationState;
  className?: string;
  onStartLocationSelect?: (location: LocationState) => void;
  onEndLocationSelect?: (location: LocationState) => void;
}

const DeliveryMapToSelect: React.FC<DeliveryMapProps> = ({ 
  startLocation, 
  endLocation, 
  className,
  onStartLocationSelect,
  onEndLocationSelect 
}) => {
  const { messages: t } = useI18n();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [originMarker, setOriginMarker] = useState<google.maps.Marker | null>(null);
  const [destinationMarker, setDestinationMarker] = useState<google.maps.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectionMode, setSelectionMode] = useState<'origin' | 'destination' | null>(null);
  const mapClickListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  // Initialize map when component mounts
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
  setError(t.map.errors.loadMap);
      } finally {
        setIsLoading(false);
      }
    };
    
    initMap();
    
    return () => {
      // Clean up code if needed
    };
  }, []);

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
  }, [map, selectionMode]);

  // Parse address components into LocationState structure
  const parseAddressComponents = (
    results: google.maps.GeocoderResult[], 
    latLng: google.maps.LatLng
  ): Partial<LocationState> => {
    const locationData: Partial<LocationState> = {
      country: '',
      state: '',
      city: '',
      address: '',
      houseNumber: '',
      latitude: latLng.lat(),
      longitude: latLng.lng(),
    };
    
    const result = results[0];
    if (!result) return locationData;
    
    // Set formatted address as fallback
    locationData.address = result.formatted_address || '';
    
    // Parse address components
    result.address_components.forEach(component => {
      const types = component.types;
      
      if (types.includes('country')) {
        locationData.country = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        locationData.state = component.long_name;
      } else if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        locationData.city = component.long_name;
      } else if (types.includes('route')) {
        locationData.address = component.long_name;
      } else if (types.includes('street_number')) {
        locationData.houseNumber = component.long_name;
      }
    });
    
    // If we didn't get a proper street address, use the formatted address
    if (!locationData.address || locationData.address === locationData.city) {
      locationData.address = result.formatted_address.split(',')[0] || '';
    }
    
    return locationData;
  };

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
      
      // Parse the address components
      const locationData = parseAddressComponents(response, latLng);
      
      // Create or update marker
      if (selectionMode === 'origin') {
        if (originMarker) originMarker.setMap(null);
        
        const newMarker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: t.map.originTitle,
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
            if (result && onStartLocationSelect) {
              onStartLocationSelect({
                ...startLocation,
                ...result,
              } as LocationState);
            }
          }
        });
        
        setOriginMarker(newMarker);
        
        if (onStartLocationSelect) {
          onStartLocationSelect({
            ...startLocation,
            ...locationData,
          } as LocationState);
        }
      } else if (selectionMode === 'destination') {
        if (destinationMarker) destinationMarker.setMap(null);
        
        const newMarker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: t.map.destinationTitle,
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
            if (result && onEndLocationSelect) {
              onEndLocationSelect({
                ...endLocation,
                ...result,
              } as LocationState);
            }
          }
        });
        
        setDestinationMarker(newMarker);
        
        if (onEndLocationSelect) {
          onEndLocationSelect({
            ...endLocation,
            ...locationData,
          } as LocationState);
        }
      }
      
      // Exit selection mode
      setSelectionMode(null);
    } catch (err) {
      console.error('Error geocoding click position:', err);
      
      // Fallback to coordinates if geocoding fails
      const fallbackLocation: Partial<LocationState> = {
        address: `${latLng.lat().toFixed(6)}, ${latLng.lng().toFixed(6)}`,
        latitude: latLng.lat(),
        longitude: latLng.lng(),
      };
      
      // Create marker with coordinates
      if (selectionMode === 'origin') {
        if (originMarker) originMarker.setMap(null);
        
        const newMarker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: t.map.originTitle,
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
        
        if (onStartLocationSelect) {
          onStartLocationSelect({
            ...startLocation,
            ...fallbackLocation,
          } as LocationState);
        }
      } else if (selectionMode === 'destination') {
        if (destinationMarker) destinationMarker.setMap(null);
        
        const newMarker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: t.map.destinationTitle,
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
        
        if (onEndLocationSelect) {
          onEndLocationSelect({
            ...endLocation,
            ...fallbackLocation,
          } as LocationState);
        }
      }
      
      // Exit selection mode
      setSelectionMode(null);
    }
  };

  // Reverse geocode (convert coordinates to address)
  const reverseGeocode = async (latLng: google.maps.LatLng): Promise<Partial<LocationState> | null> => {
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
      
      return parseAddressComponents(response, latLng);
    } catch (err) {
      console.error('Error reverse geocoding:', err);
      return {
        address: `${latLng.lat().toFixed(6)}, ${latLng.lng().toFixed(6)}`,
        latitude: latLng.lat(),
        longitude: latLng.lng(),
      };
    }
  };

  // Function to create a location string for directions service
  const createLocationString = (location: LocationState | undefined): string => {
    if (!location) return '';
    
    if (location.latitude && location.longitude) {
      return `${location.latitude},${location.longitude}`;
    }
    
    // Fallback to formatted address
    const addressParts = [];
    if (location.address) addressParts.push(location.address);
    if (location.houseNumber) addressParts.push(location.houseNumber);
    if (location.city) addressParts.push(location.city);
    if (location.state) addressParts.push(location.state);
    if (location.country) addressParts.push(location.country);
    
    return addressParts.join(', ');
  };

  // Update markers and directions when startLocation or endLocation changes
  useEffect(() => {
    const updateMap = async () => {
      if (!map) return;
      
      // Create or update origin marker based on prop
      if (startLocation?.latitude && startLocation?.longitude) {
        try {
          const latLng = new google.maps.LatLng(startLocation.latitude, startLocation.longitude);
          
          if (originMarker) originMarker.setMap(null);
          
          const newMarker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: t.map.originTitle,
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
            if (position && onStartLocationSelect) {
              const result = await reverseGeocode(position);
              if (result) {
                onStartLocationSelect({
                  ...startLocation,
                  ...result,
                } as LocationState);
              }
            }
          });
          
          setOriginMarker(newMarker);
        } catch (error) {
          console.error('Error setting origin marker:', error);
        }
      } else if (startLocation?.address) {
        try {
          // Try to geocode the address
          const startLocationStr = createLocationString(startLocation);
          const originCoords = await MapsService.geocodeAddress(startLocationStr);
          
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
              if (position && onStartLocationSelect) {
                const result = await reverseGeocode(position);
                if (result) {
                  onStartLocationSelect({
                    ...startLocation,
                    ...result,
                  } as LocationState);
                }
              }
            });
            
            setOriginMarker(newMarker);
            
            // Update coordinates in startLocation
            if (onStartLocationSelect && originCoords) {
              onStartLocationSelect({
                ...startLocation,
                latitude: originCoords.lat,
                longitude: originCoords.lng,
              });
            }
          }
        } catch (error) {
          console.error('Error setting origin marker:', error);
        }
      }
      
      // Create or update destination marker based on prop
      if (endLocation?.latitude && endLocation?.longitude) {
        try {
          const latLng = new google.maps.LatLng(endLocation.latitude, endLocation.longitude);
          
          if (destinationMarker) destinationMarker.setMap(null);
          
          const newMarker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: t.map.destinationTitle,
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
            if (position && onEndLocationSelect) {
              const result = await reverseGeocode(position);
              if (result) {
                onEndLocationSelect({
                  ...endLocation,
                  ...result,
                } as LocationState);
              }
            }
          });
          
          setDestinationMarker(newMarker);
        } catch (error) {
          console.error('Error setting destination marker:', error);
        }
      } else if (endLocation?.address) {
        try {
          // Try to geocode the address
          const endLocationStr = createLocationString(endLocation);
          const destCoords = await MapsService.geocodeAddress(endLocationStr);
          
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
              if (position && onEndLocationSelect) {
                const result = await reverseGeocode(position);
                if (result) {
                  onEndLocationSelect({
                    ...endLocation,
                    ...result,
                  } as LocationState);
                }
              }
            });
            
            setDestinationMarker(newMarker);
            
            // Update coordinates in endLocation
            if (onEndLocationSelect && destCoords) {
              onEndLocationSelect({
                ...endLocation,
                latitude: destCoords.lat,
                longitude: destCoords.lng,
              });
            }
          }
        } catch (error) {
          console.error('Error setting destination marker:', error);
        }
      }
      
      // Update route if both points exist
      if ((startLocation || originMarker) && (endLocation || destinationMarker) && directionsRenderer) {
        try {
          const directionsService = new google.maps.DirectionsService();
          
          // Create origin and destination strings for directions service
          let origin: string | google.maps.LatLng;
          let destination: string | google.maps.LatLng;
          
          // Determine origin
          if (startLocation?.latitude && startLocation?.longitude) {
            origin = new google.maps.LatLng(startLocation.latitude, startLocation.longitude);
          } else if (originMarker?.getPosition()) {
            origin = originMarker.getPosition()!;
          } else if (startLocation) {
            origin = createLocationString(startLocation);
          } else {
            return; // Can't calculate route without origin
          }
          
          // Determine destination
          if (endLocation?.latitude && endLocation?.longitude) {
            destination = new google.maps.LatLng(endLocation.latitude, endLocation.longitude);
          } else if (destinationMarker?.getPosition()) {
            destination = destinationMarker.getPosition()!;
          } else if (endLocation) {
            destination = createLocationString(endLocation);
          } else {
            return; // Can't calculate route without destination
          }
          
          const result = await directionsService.route({
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
          });
          
          directionsRenderer.setDirections(result);
          
          // Fit bounds to include route
          if (map) {
            const bounds = new google.maps.LatLngBounds();
            if (originMarker?.getPosition()) {
              bounds.extend(originMarker.getPosition()!);
            } else if (startLocation?.latitude && startLocation?.longitude) {
              bounds.extend(new google.maps.LatLng(startLocation.latitude, startLocation.longitude));
            }
            
            if (destinationMarker?.getPosition()) {
              bounds.extend(destinationMarker.getPosition()!);
            } else if (endLocation?.latitude && endLocation?.longitude) {
              bounds.extend(new google.maps.LatLng(endLocation.latitude, endLocation.longitude));
            }
            
            map.fitBounds(bounds);
          }
        } catch (err) {
          console.error('Error displaying route:', err);
        }
      }
    };
    
    updateMap();
  }, [map, directionsRenderer, startLocation, endLocation]);

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
          {selectionMode === 'origin' ? t.map.controls.cancel : t.map.controls.setOrigin}
        </button>
        <button
          onClick={() => setSelectionMode(prev => prev === 'destination' ? null : 'destination')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${selectionMode === 'destination' 
              ? 'bg-[#7f51b3] text-white' 
              : 'bg-[#241c2d] border border-[#3d2a5a] hover:border-[#7f51b3] text-white'}`}
        >
          {selectionMode === 'destination' ? t.map.controls.cancel : t.map.controls.setDestination}
        </button>
      </div>
      
      {selectionMode && (
        <div className="absolute top-4 left-4 z-20 bg-[#241c2d]/90 border border-[#3d2a5a] rounded-lg p-3 max-w-[220px]">
          <p className="text-sm text-white">
            {selectionMode === 'origin' 
              ? t.map.controls.hintOrigin 
              : t.map.controls.hintDestination}
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

export default DeliveryMapToSelect;