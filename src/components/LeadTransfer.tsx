import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { QuoteData } from './QuoteForm';
import { supabase } from '../lib/supabase';

interface LeadTransferProps {
  quoteData: QuoteData;
  quoteResponse: any;
  onBack: () => void;
}

export function LeadTransfer({ quoteData, quoteResponse, onBack }: LeadTransferProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [leadData, setLeadData] = useState({
    first_name: quoteData.driver.firstName || '',
    last_name: quoteData.driver.lastName || '',
    email: quoteData.driver.emailAddress,
    id_number: quoteData.driver.idNumber || '',
    contact_number: quoteData.driver.mobileNumber,
    application_user: '',
    application_user_email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First save quote to database
      const { data: savedQuote, error: quoteError } = await supabase
        .from('quotes')
        .insert({
          external_reference_id: `REF_${Date.now()}`,
          vehicle_data: quoteData.vehicle,
          driver_data: quoteData.driver,
          quote_response: quoteResponse,
        })
        .select()
        .single();

      if (quoteError) throw quoteError;

      // Submit lead transfer
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/lead-transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          source: 'KodomBranchOne',
          ...leadData,
          quote_id: savedQuote.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to transfer lead');
      }

      const result = await response.json();

      console.log('Lead transfer response:', result);
      
      setIsSuccess(true);
    } catch (error) {
      console.error('Lead transfer error:', error);
      alert('Failed to transfer lead. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lead Transferred Successfully!</h2>
        <p className="text-gray-600 mb-8">
          Your lead has been submitted to Pineapple Insurance. They will contact you shortly.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          Start New Quote
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Transfer Lead</h2>
        <p className="text-gray-600">Complete your details to transfer this lead</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={leadData.first_name}
              onChange={(e) => setLeadData({ ...leadData, first_name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={leadData.last_name}
              onChange={(e) => setLeadData({ ...leadData, last_name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={leadData.email}
              onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={leadData.contact_number}
              onChange={(e) => setLeadData({ ...leadData, contact_number: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Number
            </label>
            <input
              type="text"
              value={leadData.id_number}
              onChange={(e) => setLeadData({ ...leadData, id_number: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application User (Optional)
            </label>
            <input
              type="text"
              value={leadData.application_user}
              onChange={(e) => setLeadData({ ...leadData, application_user: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Agent Fullname"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application User Email (Optional)
            </label>
            <input
              type="email"
              value={leadData.application_user_email}
              onChange={(e) => setLeadData({ ...leadData, application_user_email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="agent@example.com"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Quote</span>
          </button>
          <button
            type="submit"
            disabled={!leadData.first_name || !leadData.last_name || !leadData.email || !leadData.contact_number || isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Transferring...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Transfer Lead</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}