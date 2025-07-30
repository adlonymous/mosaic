'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  showCloseButton?: boolean;
}

export function Modal({ isOpen, onClose, title, children, showCloseButton = true }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

interface LoadingModalProps {
  isOpen: boolean;
  title: string;
  message: string;
}

export function LoadingModal({ isOpen, title, message }: LoadingModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} title={title} showCloseButton={false}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </Modal>
  );
}

interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMint: (amount: string) => void;
  tokenName: string;
  tokenSymbol: string;
  isLoading?: boolean;
}

export function MintModal({ isOpen, onClose, onMint, tokenName, tokenSymbol, isLoading = false }: MintModalProps) {
  const [amount, setAmount] = useState('1000');

  const handleMint = () => {
    onMint(amount);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Mint ${tokenSymbol} Tokens`}>
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          Your {tokenName} ({tokenSymbol}) has been created successfully! 
          Would you like to mint some tokens now?
        </p>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            Amount to mint
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="1000"
            min="1"
            disabled={isLoading}
          />
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSkip}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            Skip for now
          </Button>
          <Button
            onClick={handleMint}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Minting...' : `Mint ${amount} ${tokenSymbol}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
} 