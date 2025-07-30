'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface TokenFormProps {
  title: string;
  description: string;
  icon: LucideIcon;
  formData: {
    name: string;
    symbol: string;
    decimals: string;
    [key: string]: any;
  };
  optionalFields?: {
    [key: string]: string;
  };
  onFormDataChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isCreating: boolean;
  createButtonText: string;
  creatingButtonText: string;
  disabled?: boolean;
}

export function TokenForm({
  title,
  description,
  icon: Icon,
  formData,
  optionalFields = {},
  onFormDataChange,
  onSubmit,
  isCreating,
  createButtonText,
  creatingButtonText,
  disabled = false,
}: TokenFormProps) {
  const [showOptionalParams, setShowOptionalParams] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    onFormDataChange(field, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Card className={disabled ? "opacity-75" : ""}>
      <CardHeader>
        <div className="flex items-center">
          <Icon className="h-8 w-8 text-primary mr-3" />
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {disabled 
                ? "Token has been created successfully. Configuration is now locked."
                : description
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Required Fields */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Required Parameters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Token Name"
                    required
                    disabled={disabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Symbol *
                  </label>
                  <input
                    type="text"
                    value={formData.symbol}
                    onChange={e => handleInputChange('symbol', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="USD"
                    required
                    disabled={disabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Decimals *
                  </label>
                  <input
                    type="number"
                    value={formData.decimals}
                    onChange={e => handleInputChange('decimals', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="6"
                    min="0"
                    max="9"
                    required
                    disabled={disabled}
                  />
                </div>
              </div>
            </div>

            {/* Optional Parameters Dropdown */}
            {Object.keys(optionalFields).length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <button
                  type="button"
                  onClick={() => setShowOptionalParams(!showOptionalParams)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:scale-[1.01] transition-transform duration-200 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={disabled}
                >
                  <span className="font-medium">Optional Parameters</span>
                  {showOptionalParams ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>

                {showOptionalParams && (
                  <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {Object.entries(optionalFields).map(([key, placeholder]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </label>
                          <input
                            type="text"
                            value={formData[key] || ''}
                            onChange={e => handleInputChange(key, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder={placeholder}
                            disabled={disabled}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <Button type="submit" className="px-8" disabled={isCreating || disabled}>
              {isCreating ? creatingButtonText : createButtonText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 