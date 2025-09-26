export type DistanceResult = {
  distance: number; // in kilometers
  duration: number; // in minutes
  durationText: string;
};

export class MapsService {
  private static distanceService: google.maps.DistanceMatrixService | null = null;
  private static geocoder: google.maps.Geocoder | null = null;
  private static isLoaded = false;
  private static loadPromise: Promise<boolean> | null = null;

  public static async init(): Promise<boolean> {
    // Return existing promise if already initializing
    if (this.loadPromise) return this.loadPromise;
    
    // Return true if already loaded
    if (this.isLoaded) return true;
    
    this.loadPromise = new Promise((resolve) => {
      if (window.google && window.google.maps) {
        this.setupServices();
        resolve(true);
        return;
      }

      // Load the script if it's not already loaded
      const googleMapsScript = document.createElement('script');
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;
      
      googleMapsScript.onload = () => {
        this.setupServices();
        resolve(true);
      };
      
      googleMapsScript.onerror = () => {
        console.error("Failed to load Google Maps API");
        resolve(false);
      };
      
      document.head.appendChild(googleMapsScript);
    });
    
    return this.loadPromise;
  }
  
  private static setupServices(): void {
    if (window.google && window.google.maps) {
      this.distanceService = new google.maps.DistanceMatrixService();
      this.geocoder = new google.maps.Geocoder();
      this.isLoaded = true;
    }
  }
  
  public static async getDistanceAndTime(
    origin: string, 
    destination: string
  ): Promise<DistanceResult | null> {
    await this.init();
    
    if (!this.distanceService) return null;
    
    try {
      const response = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
        this.distanceService!.getDistanceMatrix({
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
        }, (response, status) => {
          if (status === 'OK' && response) {
            resolve(response);
          } else {
            reject(status);
          }
        });
      });
      
      const result = response.rows[0].elements[0];
      if (result.status === 'OK') {
        return {
          distance: result.distance.value / 1000, // Convert meters to km
          duration: result.duration.value / 60, // Convert seconds to minutes
          durationText: result.duration.text
        };
      }
      return null;
    } catch (error) {
      console.error("Error calculating distance:", error);
      return null;
    }
  }
  
  public static async geocodeAddress(address: string): Promise<google.maps.LatLngLiteral | null> {
    await this.init();
    
    if (!this.geocoder) return null;
    
    try {
      const response = await new Promise<google.maps.GeocoderResponse>((resolve, reject) => {
        this.geocoder!.geocode({ address }, (results, status) => {
          if (status === 'OK') {
            // Type assertion to satisfy TypeScript may not be necessary in all environments
            resolve(results as any);
          } else {
            reject(status);
          }
        });
      });
      
      if (response.results && response.results[0]) {
        const location = response.results[0].geometry.location;
        return { lat: location.lat(), lng: location.lng() };
      }
      return null;
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  }
}