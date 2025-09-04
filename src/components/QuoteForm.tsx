import React, { useState } from 'react';
import { Car, User, MapPin, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { VehicleDetails } from './VehicleDetails';
import { DriverDetails } from './DriverDetails';
import { AddressDetails } from './AddressDetails';
import { QuoteResults } from './QuoteResults';
import { LeadTransfer } from './LeadTransfer';

export type VehicleData = {
  year: number;
  make: string;
  model: string;
  mmCode: string;
  modified: string;
  category: string;
  colour: string;
  engineSize: number;
  financed: string;
  owner: string;
  status: string;
  partyIsRegularDriver: string;
  accessories: string;
  accessoriesAmount: number;
  retailValue: number;
  marketValue: number;
  insuredValueType: string;
  useType: string;
  overnightParkingSituation: string;
  coverCode: string;
};

export type AddressData = {
  addressLine: string;
  postalCode: number;
  suburb: string;
  latitude: number;
  longitude: number;
};

export type DriverData = {
  firstName?: string;
  lastName?: string;
  maritalStatus: string;
  currentlyInsured: boolean;
  yearsWithoutClaims: number;
  relationToPolicyHolder: string;
  emailAddress: string;
  mobileNumber: string;
  idNumber?: string;
  prvInsLosses: number;
  licenseIssueDate: string;
  dateOfBirth: string;
};

export type QuoteData = {
  vehicle: VehicleData;
  address: AddressData;
  driver: DriverData;
};

const steps = [
  { id: 1, name: 'Vehicle Details', icon: Car },
  { id: 2, name: 'Driver Details', icon: User },
  { id: 3, name: 'Address Details', icon: MapPin },
  { id: 4, name: 'Quote Results', icon: Shield },
];

export function QuoteForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteData, setQuoteData] = useState<QuoteData>({
    vehicle: {
      year: new Date().getFullYear(),
      make: '',
      model: '',
      mmCode: '00000000',
      modified: 'N',
      category: 'HB',
      colour: '',
      engineSize: 1.2,
      financed: 'N',
      owner: 'Y',
      status: 'New',
      partyIsRegularDriver: 'Y',
      accessories: 'N',
      accessoriesAmount: 0,
      retailValue: 0,
      marketValue: 180000,
      insuredValueType: 'Retail',
      useType: 'Private',
      overnightParkingSituation: 'Garage',
      coverCode: 'Comprehensive',
    },
    address: {
      addressLine: '',
      postalCode: 0,
      suburb: '',
      latitude: -26.10757,
      longitude: 28.0567,
    },
    driver: {
      maritalStatus: 'Single',
      currentlyInsured: false,
      yearsWithoutClaims: 0,
      relationToPolicyHolder: 'Self',
      emailAddress: '',
      mobileNumber: '',
      prvInsLosses: 0,
      licenseIssueDate: '',
      dateOfBirth: '',
    },
  });

  const [quoteResponse, setQuoteResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadTransfer, setShowLeadTransfer] = useState(false);

  const updateQuoteData = (section: keyof QuoteData, data: any) => {
    setQuoteData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuoteSubmit = async () => {
    setIsLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/quick-quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          source: 'KodomBranchOne',
          externalReferenceId: `REF_${Date.now()}`,
          vehicles: [{
            ...quoteData.vehicle,
            address: quoteData.address,
            regularDriver: quoteData.driver,
          }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get quote');
      }

      const result = await response.json();
      setQuoteResponse(result);
      setCurrentStep(4);
    } catch (error) {
      console.error('Quote error:', error);
      alert('Failed to get quote. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <VehicleDetails
            data={quoteData.vehicle}
            onChange={(data) => updateQuoteData('vehicle', data)}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <DriverDetails
            data={quoteData.driver}
            onChange={(data) => updateQuoteData('driver', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <AddressDetails
            data={quoteData.address}
            onChange={(data) => updateQuoteData('address', data)}
            onGetQuote={handleQuoteSubmit}
            onBack={handleBack}
            isLoading={isLoading}
          />
        );
      case 4:
        return showLeadTransfer ? (
          <LeadTransfer
            quoteData={quoteData}
            quoteResponse={quoteResponse}
            onBack={() => setShowLeadTransfer(false)}
          />
        ) : (
          <QuoteResults
            quoteResponse={quoteResponse}
            onTransferLead={() => setShowLeadTransfer(true)}
            onNewQuote={() => {
              setCurrentStep(1);
              setQuoteResponse(null);
              setShowLeadTransfer(false);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Insurance Quote</h1>
          <p className="text-lg text-gray-600">Get your instant motor insurance quote</p>
        </div>

        {!showLeadTransfer && currentStep < 4 && (
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.slice(0, 3).map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`flex items-center ${step.id !== 3 ? 'flex-1' : ''}`}
                  >
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        currentStep >= step.id
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium ${
                        currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    >
                      {step.name}
                    </span>
                    {step.id !== 3 && (
                      <div
                        className={`flex-1 h-0.5 ml-4 ${
                          currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}