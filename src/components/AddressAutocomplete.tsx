import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useAddressSearch, AddressSuggestion } from '../hooks/useAddressSearch';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: {
    addressLine: string;
    suburb: string;
    postalCode: number;
    latitude: number;
    longitude: number;
  }) => void;
  placeholder?: string;
  required?: boolean;
}

export function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Start typing your address...",
  required = false
}: AddressAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { suggestions, isLoading, searchAddresses, clearSuggestions } = useAddressSearch();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    
    if (newValue.length >= 3) {
      searchAddresses(newValue);
      setIsOpen(true);
    } else {
      clearSuggestions();
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    const addressLine = suggestion.address.house_number && suggestion.address.road
      ? `${suggestion.address.house_number} ${suggestion.address.road}`
      : suggestion.address.road || suggestion.display_name.split(',')[0];
    
    const suburb = suggestion.address.suburb || suggestion.address.city || '';
    const postalCode = suggestion.address.postcode ? parseInt(suggestion.address.postcode) : 0;
    
    setInputValue(addressLine);
    onChange(addressLine);
    
    onAddressSelect({
      addressLine,
      suburb,
      postalCode,
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon)
    });
    
    setIsOpen(false);
    clearSuggestions();
  };

  const formatDisplayName = (suggestion: AddressSuggestion) => {
    const parts = suggestion.display_name.split(',');
    // Show first 3 parts for cleaner display
    return parts.slice(0, 3).join(', ');
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder={placeholder}
          required={required}
          autoComplete="off"
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" size={18} />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700 focus:outline-none border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex items-start space-x-2">
                <MapPin className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {suggestion.address.house_number && suggestion.address.road
                      ? `${suggestion.address.house_number} ${suggestion.address.road}`
                      : suggestion.address.road || formatDisplayName(suggestion)
                    }
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {formatDisplayName(suggestion)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && !isLoading && suggestions.length === 0 && inputValue.length >= 3 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
        >
          <div className="px-4 py-3 text-sm text-gray-500">
            No addresses found. Try a different search term.
          </div>
        </div>
      )}
    </div>
  );
}