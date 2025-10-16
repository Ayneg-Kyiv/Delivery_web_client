import React, { useRef, useEffect } from 'react';

interface AddressAutocompleteInputProps {
  value: string;
  onChange: (address: string, locationObj?: Partial<LocationState>) => void;
  placeholder?: string;
  className?: string;
}

const AddressAutocompleteInput: React.FC<AddressAutocompleteInputProps> = ({
  value = '',
  onChange,
  placeholder,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current!, {
      types: ['address'],
      componentRestrictions: { country: 'ua' }, // restrict to Ukraine, change as needed
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.formatted_address) return;

      // Extract address components for createLocationDto
      const locationObj: Partial<LocationState> = {};
      place.address_components?.forEach(comp => {
        if (comp.types.includes('country')) locationObj.country = comp.long_name;
        if (comp.types.includes('administrative_area_level_1')) locationObj.state = comp.long_name;
        if (comp.types.includes('locality')) locationObj.city = comp.long_name;
        if (comp.types.includes('route')) locationObj.address = comp.long_name;
        if (comp.types.includes('street_number')) locationObj.houseNumber = comp.long_name;
      });
      if (place.geometry?.location) {
        locationObj.latitude = place.geometry.location.lat();
        locationObj.longitude = place.geometry.location.lng();
      }

      onChange(place.formatted_address, locationObj);
    });
  }, [onChange]);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      type="text"
      autoComplete="off"
    />
  );
};

export default AddressAutocompleteInput;