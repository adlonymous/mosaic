'use client';

import { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { StablecoinOptions, StablecoinCreationResult } from '@/types/token';
import { mockCreateStablecoinForUI, mockMintTokens, MintResult } from '@/lib/mockFunctions';
import { useWallet } from '@solana/wallet-adapter-react';
import { LoadingModal, MintModal } from '@/components/ui/modal';
import { TokenForm, TokenResult, MintResult as MintResultComponent, PageHeader } from '@/components/token';

export default function StablecoinCreatePage() {
  const { publicKey, connected } = useWallet();
  const [stablecoinOptions, setStablecoinOptions] = useState<StablecoinOptions>({
    name: '',
    symbol: '',
    decimals: '6',
    uri: '',
    mintAuthority: '',
    metadataAuthority: '',
    pausableAuthority: '',
    confidentialBalancesAuthority: '',
    permanentDelegateAuthority: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [result, setResult] = useState<StablecoinCreationResult | null>(null);
  const [mintResult, setMintResult] = useState<MintResult | null>(null);
  const [showMintModal, setShowMintModal] = useState(false);
  const [createdToken, setCreatedToken] = useState<{ name: string; symbol: string; mintAddress?: string } | null>(null);

  const handleFormDataChange = (field: string, value: string) => {
    setStablecoinOptions(prev => ({ ...prev, [field]: value }));
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
      const result = await mockCreateStablecoinForUI(stablecoinOptions, {
        publicKey,
        connected: true,
      });
      setResult(result);

      if (result.success) {
        setCreatedToken({
          name: stablecoinOptions.name,
          symbol: stablecoinOptions.symbol,
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
      const result = await mockMintTokens(createdToken.mintAddress, amount, {
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
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Create Stablecoin"
          description="Configure your stablecoin parameters"
          backHref="/dashboard/create"
        />

        <TokenForm
          title="Stablecoin Configuration"
          description="Fill in the required fields to create your regulatory-compliant stablecoin"
          icon={DollarSign}
          formData={stablecoinOptions}
          optionalFields={optionalFields}
          onFormDataChange={handleFormDataChange}
          onSubmit={handleSubmit}
          isCreating={isCreating}
          createButtonText="Create Stablecoin"
          creatingButtonText="Creating..."
          disabled={result?.success === true}
        />

        {/* Token Creation Result */}
        {result && (
          <TokenResult
            success={result.success}
            title="Stablecoin Creation"
            details={result.details}
            mintAddress={result.mintAddress}
            transactionSignature={result.transactionSignature}
            error={result.error}
            metadataUri={stablecoinOptions.uri}
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
          title="Creating Stablecoin"
          message="Please wait while we create your stablecoin..."
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
