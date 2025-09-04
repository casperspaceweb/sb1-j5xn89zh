import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { DriverData } from './QuoteForm';

interface DriverDetailsProps {
  data: DriverData;
  onChange: (data: Partial<DriverData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function DriverDetails({ data, onChange, onNext, onBack }: DriverDetailsProps) {
  // Function to extract date of birth from SA ID number
  const extractDateFromId = (idNumber: string) => {
    if (idNumber.length >= 6) {
      const year = idNumber.substring(0, 2);
      const month = idNumber.substring(2, 4);
      const day = idNumber.substring(4, 6);
      
      // Determine century (assuming current year is 2025)
      const fullYear = parseInt(year) <= 25 ? `20${year}` : `19${year}`;
      
      return `${fullYear}-${month}-${day}`;
    }
    return '';
  };

  // Function to extract names from full name
  const extractNames = (fullName: string) => {
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return {
        firstName: names[0],
        lastName: names.slice(1).join(' ')
      };
    }
    return { firstName: fullName, lastName: '' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.emailAddress && data.mobileNumber && data.dateOfBirth) {
      onNext();
    }
  };

  const handleIdNumberChange = (idNumber: string) => {
    onChange({ idNumber });
    
    // Auto-populate date of birth if ID number is valid length
    if (idNumber.length >= 6) {
      const dateOfBirth = extractDateFromId(idNumber);
      if (dateOfBirth) {
        onChange({ dateOfBirth });
      }
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Driver Details</h2>
        <p className="text-gray-600">Information about the primary driver</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              onChange={(e) => {
                const { firstName, lastName } = extractNames(e.target.value);
                onChange({ 
                  firstName,
                  lastName 
                });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Smith"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.firstName || ''}
              onChange={(e) => onChange({ firstName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              placeholder="Auto-populated from full name"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.lastName || ''}
              onChange={(e) => onChange({ lastName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              placeholder="Auto-populated from full name"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={data.emailAddress}
              onChange={(e) => onChange({ emailAddress: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={data.mobileNumber}
              onChange={(e) => onChange({ mobileNumber: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0821234567"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.idNumber || ''}
              onChange={(e) => handleIdNumberChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="9404054800086"
              maxLength={13}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Date of birth will be auto-populated</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => onChange({ dateOfBirth: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              readOnly
              required
            />
            <p className="text-xs text-gray-500 mt-1">Auto-populated from ID number</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Issue Date
            </label>
            <input
              type="date"
              value={data.licenseIssueDate}
              onChange={(e) => onChange({ licenseIssueDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marital Status
            </label>
            <select
              value={data.maritalStatus}
              onChange={(e) => onChange({ maritalStatus: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years Without Claims
            </label>
            <input
              type="number"
              min="0"
              max="20"
              value={data.yearsWithoutClaims}
              onChange={(e) => onChange({ yearsWithoutClaims: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Previous Insurance Losses
            </label>
            <input
              type="number"
              min="0"
              value={data.prvInsLosses}
              onChange={(e) => onChange({ prvInsLosses: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="currentlyInsured"
              checked={data.currentlyInsured}
              onChange={(e) => onChange({ currentlyInsured: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="currentlyInsured" className="ml-2 text-sm text-gray-700">
              Currently insured
            </label>
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
            disabled={!data.emailAddress || !data.mobileNumber || !data.dateOfBirth || !data.idNumber}
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