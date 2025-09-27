declare global {
  interface Window {
    google: {
      maps: {
        Map: typeof google.maps.Map;
        Marker: typeof google.maps.Marker;
        LatLng: typeof google.maps.LatLng;
        DirectionsService: typeof google.maps.DirectionsService;
        DirectionsRenderer: typeof google.maps.DirectionsRenderer;
        TravelMode: {
          DRIVING: google.maps.TravelMode.DRIVING;
          BICYCLING: google.maps.TravelMode.BICYCLING;
          TRANSIT: google.maps.TravelMode.TRANSIT;
          WALKING: google.maps.TravelMode.WALKING;
        };
        DistanceMatrixService: typeof google.maps.DistanceMatrixService;
        UnitSystem: {
          IMPERIAL: google.maps.UnitSystem.IMPERIAL;
          METRIC: google.maps.UnitSystem.METRIC;
        };
        Geocoder: typeof google.maps.Geocoder;
      };
    };
  }
}

export {};