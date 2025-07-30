'use client';

import { useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import { ArcadeTokenOptions, ArcadeTokenCreationResult } from '@/types/token';
import { createArcadeToken, mintArcadeToken } from '@/lib/arcadeToken';

// Define mint result type
interface MintResult {
  success: boolean;
  error?: string;
  transactionSignature?: string;
  amount?: string;
}
import { useWallet } from '@solana/wallet-adapter-react';
import { LoadingModal, MintModal } from '@/components/ui/modal';
import { TokenForm, TokenResult, MintResult as MintResultComponent, PageHeader } from '@/components/token';

export default function ArcadeTokenCreatePage() {
  const { publicKey, connected } = useWallet();
  const [arcadeTokenOptions, setArcadeTokenOptions] = useState<ArcadeTokenOptions>({
    name: '',
    symbol: '',
    decimals: '6',
    uri: '',
    mintAuthority: '',
    metadataAuthority: '',
    pausableAuthority: '',
    confidentialBalancesAuthority: '',
    permanentDelegateAuthority: '',
    mintKeypair: '',
    keypair: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [result, setResult] = useState<ArcadeTokenCreationResult | null>(null);
  const [mintResult, setMintResult] = useState<MintResult | null>(null);
  const [showMintModal, setShowMintModal] = useState(false);
  const [createdToken, setCreatedToken] = useState<{ name: string; symbol: string; mintAddress?: string } | null>(null);

  const handleFormDataChange = (field: string, value: string) => {
    setArcadeTokenOptions(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected || !publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    setIsCreating(true);
    setResult(null);

    try {
      const result = await createArcadeToken(arcadeTokenOptions, {
        publicKey,
        connected: true,
      });
      setResult(result);

      if (result.success) {
        setCreatedToken({
          name: arcadeTokenOptions.name,
          symbol: arcadeTokenOptions.symbol,
          mintAddress: result.mintAddress,
        });
        setShowMintModal(true);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleMint = async (amount: string) => {
    if (!connected || !publicKey || !createdToken?.mintAddress) {
      alert('Please connect your wallet first');
      return;
    }

    setIsMinting(true);
    setMintResult(null);

    try {
      const result = await mintArcadeToken(createdToken.mintAddress, publicKey.toString(), amount, {
        publicKey,
        connected: true,
      });
      setMintResult(result);

      if (result.success) {
        setShowMintModal(false);
      }
    } catch (error) {
      setMintResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsMinting(false);
    }
  };

  const optionalFields = {
    mintAuthority: 'Public key',
    metadataAuthority: 'Public key',
    pausableAuthority: 'Public key',
    confidentialBalancesAuthority: 'Public key',
    permanentDelegateAuthority: 'Public key',
    mintKeypair: 'Base58 encoded keypair',
    keypair: 'Base58 encoded keypair',
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Create Arcade Token"
          description="Configure your arcade token parameters"
          backHref="/dashboard/create"
        />

        <TokenForm
          title="Arcade Token Configuration"
          description="Fill in the required fields to create your gaming or utility token"
          icon={Gamepad2}
          formData={arcadeTokenOptions}
          optionalFields={optionalFields}
          onFormDataChange={handleFormDataChange}
          onSubmit={handleSubmit}
          isCreating={isCreating}
          createButtonText="Create Arcade Token"
          creatingButtonText="Creating..."
          disabled={result?.success === true}
        />

        {/* Token Creation Result */}
        {result && (
          <TokenResult
            success={result.success}
            title="Arcade Token Creation"
            details={result.details}
            mintAddress={result.mintAddress}
            transactionSignature={result.transactionSignature}
            error={result.error}
            metadataUri={arcadeTokenOptions.uri}
          />
        )}

        {/* Mint Result */}
        {mintResult && (
          <MintResultComponent
            success={mintResult.success}
            amount={mintResult.amount}
            symbol={createdToken?.symbol}
            transactionSignature={mintResult.transactionSignature}
            error={mintResult.error}
          />
        )}

        {/* Loading Modal */}
        <LoadingModal
          isOpen={isCreating}
          title="Creating Arcade Token"
          message="Please wait while we create your arcade token..."
        />

        {/* Mint Modal */}
        <MintModal
          isOpen={showMintModal}
          onClose={() => setShowMintModal(false)}
          onMint={handleMint}
          tokenName={createdToken?.name || ''}
          tokenSymbol={createdToken?.symbol || ''}
          isLoading={isMinting}
        />
      </div>
    </div>
  );
}
