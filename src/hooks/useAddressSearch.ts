import { useState, useEffect, useCallback } from 'react';

export interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    postcode?: string;
    state?: string;
    country?: string;
  };
}

export function useAddressSearch() {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAddresses = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Using Nominatim API with South Africa country code
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}&` +
        `countrycodes=za&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=5&` +
        `dedupe=1`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce the search function
  const debouncedSearch = useCallback(
    debounce(searchAddresses, 300),
    [searchAddresses]
  );

  return {
    suggestions,
    isLoading,
    error,
    searchAddresses: debouncedSearch,
    clearSuggestions: () => setSuggestions([])
  };
}

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}