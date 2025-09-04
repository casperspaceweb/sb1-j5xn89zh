import React from 'react';
import { ArrowRight } from 'lucide-react';
import { VehicleData } from './QuoteForm';

interface VehicleDetailsProps {
  data: VehicleData;
  onChange: (data: Partial<VehicleData>) => void;
  onNext: () => void;
}

export function VehicleDetails({ data, onChange, onNext }: VehicleDetailsProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.make && data.model && data.year) {
      onNext();
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Details</h2>
        <p className="text-gray-600">Tell us about your vehicle</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year <span className="text-red-500">*</span>
            </label>
            <select
              value={data.year}
              onChange={(e) => onChange({ year: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Make <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.make}
              onChange={(e) => onChange({ make: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Volkswagen"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.model}
              onChange={(e) => onChange({ model: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Polo Tsi 1.2 Comfortline"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colour
            </label>
            <input
              type="text"
              value={data.colour}
              onChange={(e) => onChange({ colour: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., White"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Engine Size (L)
            </label>
            <input
              type="number"
              step="0.1"
              value={data.engineSize}
              onChange={(e) => onChange({ engineSize: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Type
            </label>
            <select
              value={data.coverCode}
              onChange={(e) => onChange({ coverCode: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Comprehensive">Comprehensive</option>
              <option value="Third Party">Third Party</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retail Value (R)
            </label>
            <input
              type="number"
              value={data.retailValue}
              onChange={(e) => onChange({ retailValue: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="200000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overnight Parking
            </label>
            <select
              value={data.overnightParkingSituation}
              onChange={(e) => onChange({ overnightParkingSituation: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Garage">Garage</option>
              <option value="Carport">Carport</option>
              <option value="Open Parking">Open Parking</option>
              <option value="Street">Street</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Use Type
            </label>
            <select
              value={data.useType}
              onChange={(e) => onChange({ useType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Private">Private</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accessories
            </label>
            <select
              value={data.accessories}
              onChange={(e) => onChange({ 
                accessories: e.target.value,
                accessoriesAmount: e.target.value === 'N' ? 0 : data.accessoriesAmount
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="N">No</option>
              <option value="Y">Yes</option>
            </select>
          </div>

          {data.accessories === 'Y' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accessories Value (R)
              </label>
              <input
                type="number"
                value={data.accessoriesAmount}
                onChange={(e) => onChange({ accessoriesAmount: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="20000"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!data.make || !data.model}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <span>Continue</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}