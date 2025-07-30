import {
  StablecoinOptions,
  StablecoinCreationResult,
  ArcadeTokenOptions,
  ArcadeTokenCreationResult,
} from '@/types/token';
import { WalletAdapter } from '@/types/wallet';

// Mock mint result interface
export interface MintResult {
  success: boolean;
  error?: string;
  transactionSignature?: string;
  amount?: string;
}

// Mock function for stablecoin creation
export const mockCreateStablecoinForUI = async (
  options: StablecoinOptions,
  wallet: WalletAdapter
): Promise<StablecoinCreationResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate random success/failure for testing
  const isSuccess = Math.random() > 0.2; // 80% success rate

  if (isSuccess) {
    return {
      success: true,
      transactionSignature:
        'mock_signature_' + Math.random().toString(36).substring(7),
      mintAddress:
        'mock_mint_address_' + Math.random().toString(36).substring(7),
      details: {
        name: options.name,
        symbol: options.symbol,
        decimals: parseInt(options.decimals, 10),
        mintAuthority:
          options.mintAuthority ||
          wallet.publicKey?.toString() ||
          'mock_authority',
        metadataAuthority:
          options.metadataAuthority ||
          options.mintAuthority ||
          wallet.publicKey?.toString() ||
          'mock_authority',
        pausableAuthority:
          options.pausableAuthority ||
          options.mintAuthority ||
          wallet.publicKey?.toString() ||
          'mock_authority',
        confidentialBalancesAuthority:
          options.confidentialBalancesAuthority ||
          options.mintAuthority ||
          wallet.publicKey?.toString() ||
          'mock_authority',
        permanentDelegateAuthority:
          options.permanentDelegateAuthority ||
          options.mintAuthority ||
          wallet.publicKey?.toString() ||
          'mock_authority',
        extensions: [
          'Metadata',
          'Pausable',
          'Default Account State (Blocklist)',
          'Confidential Balances',
          'Permanent Delegate',
        ],
      },
    };
  } else {
    return {
      success: false,
      error: 'Mock error: Failed to create stablecoin (simulated failure)',
    };
  }
};

// Mock function for minting tokens
export const mockMintTokens = async (
  mintAddress: string,
  amount: string,
  wallet: WalletAdapter
): Promise<MintResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate random success/failure for testing
  const isSuccess = Math.random() > 0.1; // 90% success rate

  if (isSuccess) {
    return {
      success: true,
      transactionSignature:
        'mock_mint_signature_' + Math.random().toString(36).substring(7),
      amount: amount,
    };
  } else {
    return {
      success: false,
      error: 'Mock error: Failed to mint tokens (simulated failure)',
    };
  }
};

// Mock function for arcade token creation
export const mockCreateArcadeTokenForUI = async (
  options: ArcadeTokenOptions,
  wallet: WalletAdapter
): Promise<ArcadeTokenCreationResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate random success/failure for testing
  const isSuccess = Math.random() > 0.2; // 80% success rate

  if (isSuccess) {
    return {
      success: true,
      transactionSignature:
        'mock_signature_' + Math.random().toString(36).substring(7),
      mintAddress:
        'mock_mint_address_' + Math.random().toString(36).substring(7),
      details: {
        name: options.name,
        symbol: options.symbol,
        decimals: parseInt(options.decimals, 10),
        mintAuthority:
          options.mintAuthority ||
          wallet.publicKey?.toString() ||
          'mock_authority',
        metadataAuthority:
          options.metadataAuthority ||
          options.mintAuthority ||
          wallet.publicKey?.toString() ||
          'mock_authority',
        pausableAuthority:
          options.pausableAuthority ||
          options.mintAuthority ||
          wallet.publicKey?.toString() ||
          'mock_authority',
        permanentDelegateAuthority:
          options.permanentDelegateAuthority ||
          options.mintAuthority ||
          wallet.publicKey?.toString() ||
          'mock_authority',
        extensions: [
          'Metadata',
          'Pausable',
          'Default Account State (Blocklist)',
          'Permanent Delegate',
        ],
      },
    };
  } else {
    return {
      success: false,
      error: 'Mock error: Failed to create arcade token (simulated failure)',
    };
  }
};
