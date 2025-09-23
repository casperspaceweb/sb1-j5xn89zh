import React from 'react';
import { CheckCircle, Send, RotateCcw } from 'lucide-react';

interface QuoteResultsProps {
  quoteResponse: any;
  onTransferLead: () => void;
  onNewQuote: () => void;
}

export function QuoteResults({ quoteResponse, onTransferLead, onNewQuote }: QuoteResultsProps) {
  if (!quoteResponse) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 dark:text-gray-300">No quote data available.</p>
      </div>
    );
  }

  // Extract premium and excess from response - adjust based on actual API response structure
  const premium = quoteResponse?.data?.[0]?.premium || 'N/A';
  const excess = quoteResponse?.data?.[0]?.excess || 'N/A';

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quote Generated Successfully!</h2>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quote Generated Successfully!</h2>
        <p className="text-gray-600 dark:text-gray-300">Here are your insurance quote details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Monthly Premium</h3>
          <p className="text-3xl font-bold text-blue-600">
            R{typeof premium === 'number' ? Math.round(premium).toLocaleString() : premium}
          </p>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
          <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">Excess</h3>
          <p className="text-3xl font-bold text-orange-600">
            R{typeof excess === 'number' ? excess.toLocaleString() : excess}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onTransferLead}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
        >
          <Send size={20} />
          <span>Transfer Lead</span>
        </button>
        <button
          onClick={onNewQuote}
          className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
        >
          <RotateCcw size={20} />
          <span>New Quote</span>
        </button>
      </div>
    </div>
  );
}