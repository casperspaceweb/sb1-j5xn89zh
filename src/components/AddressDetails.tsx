import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { AddressData } from './QuoteForm';
import { AddressAutocomplete } from './AddressAutocomplete';

interface AddressDetailsProps {
  data: AddressData;
  onChange: (data: Partial<AddressData>) => void;
  onGetQuote: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function AddressDetails({ data, onChange, onGetQuote, onBack, isLoading }: AddressDetailsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.addressLine && data.suburb && data.postalCode) {
      onGetQuote();
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Address Details</h2>
        <p className="text-gray-600 dark:text-gray-300">Where is your vehicle kept overnight?</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address Line <span className="text-red-500">*</span>
            </label>
            <AddressAutocomplete
              value={data.addressLine}
              onChange={(value) => onChange({ addressLine: value })}
              onAddressSelect={(address) => {
                onChange({
                  addressLine: address.addressLine,
                  suburb: address.suburb,
                  postalCode: address.postalCode,
                  latitude: address.latitude,
                  longitude: address.longitude
                });
              }}
              placeholder="Start typing your address..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suburb <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.suburb}
              onChange={(e) => onChange({ suburb: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              placeholder="Sandton"
              readOnly
              required
            />
            <p className="text-xs text-gray-500 mt-1">Auto-populated from address selection</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={data.postalCode || ''}
              onChange={(e) => onChange({ postalCode: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              placeholder="2196"
              readOnly
              required
            />
            <p className="text-xs text-gray-500 mt-1">Auto-populated from address selection</p>
          </div>

        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <button
            type="submit"
            disabled={!data.addressLine || !data.suburb || !data.postalCode || isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Getting Quote...</span>
              </>
            ) : (
              <>
                <Shield size={20} />
                <span>Get Quote</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}