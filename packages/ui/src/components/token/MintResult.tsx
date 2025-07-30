'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface MintResultProps {
  success: boolean;
  amount?: string;
  symbol?: string;
  transactionSignature?: string;
  error?: string;
}

export function MintResult({
  success,
  amount,
  symbol,
  transactionSignature,
  error,
}: MintResultProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle
          className={success ? 'text-green-600' : 'text-red-600'}
        >
          {success
            ? '✅ Token Minting Successful'
            : '❌ Token Minting Failed'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                📋 Mint Details:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-900 dark:text-gray-100">
                {amount && symbol && (
                  <div>
                    <span className="font-medium">Amount Minted:</span>{' '}
                    {amount} {symbol}
                  </div>
                )}
                {transactionSignature && (
                  <div>
                    <span className="font-medium">Transaction:</span>{' '}
                    {transactionSignature}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-red-600 dark:text-red-400">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 