'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface TokenResultProps {
  success: boolean;
  title: string;
  details?: {
    name?: string;
    symbol?: string;
    decimals?: number;
    mintAuthority?: string;
    metadataAuthority?: string;
    pausableAuthority?: string;
    confidentialBalancesAuthority?: string;
    permanentDelegateAuthority?: string;
    extensions?: string[];
  };
  mintAddress?: string;
  transactionSignature?: string;
  error?: string;
  metadataUri?: string;
}

export function TokenResult({
  success,
  title,
  details,
  mintAddress,
  transactionSignature,
  error,
  metadataUri,
}: TokenResultProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle
          className={success ? 'text-green-600' : 'text-red-600'}
        >
          {success ? `✅ ${title} Successful` : `❌ ${title} Failed`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                📋 Details:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-900 dark:text-gray-100">
                {details?.name && (
                  <div>
                    <span className="font-medium">Name:</span>{' '}
                    {details.name}
                  </div>
                )}
                {details?.symbol && (
                  <div>
                    <span className="font-medium">Symbol:</span>{' '}
                    {details.symbol}
                  </div>
                )}
                {details?.decimals !== undefined && (
                  <div>
                    <span className="font-medium">Decimals:</span>{' '}
                    {details.decimals}
                  </div>
                )}
                {mintAddress && (
                  <div>
                    <span className="font-medium">Mint Address:</span>{' '}
                    {mintAddress}
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

            {details?.mintAuthority && (
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  🔐 Authorities:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-900 dark:text-gray-100">
                  {details.mintAuthority && (
                    <div>
                      <span className="font-medium">Mint Authority:</span>{' '}
                      {details.mintAuthority}
                    </div>
                  )}
                  {details.metadataAuthority && (
                    <div>
                      <span className="font-medium">Metadata Authority:</span>{' '}
                      {details.metadataAuthority}
                    </div>
                  )}
                  {details.pausableAuthority && (
                    <div>
                      <span className="font-medium">Pausable Authority:</span>{' '}
                      {details.pausableAuthority}
                    </div>
                  )}
                  {details.confidentialBalancesAuthority && (
                    <div>
                      <span className="font-medium">
                        Confidential Balances Authority:
                      </span>{' '}
                      {details.confidentialBalancesAuthority}
                    </div>
                  )}
                  {details.permanentDelegateAuthority && (
                    <div>
                      <span className="font-medium">
                        Permanent Delegate Authority:
                      </span>{' '}
                      {details.permanentDelegateAuthority}
                    </div>
                  )}
                </div>
              </div>
            )}

            {details?.extensions && details.extensions.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  🛡️ Token Extensions:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {details.extensions.map((ext: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs"
                    >
                      ✓ {ext}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {metadataUri && (
              <div>
                <span className="font-medium">Metadata URI:</span>{' '}
                {metadataUri}
              </div>
            )}
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