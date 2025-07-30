import {
  signTransactionMessageWithSigners,
  generateKeyPairSigner,
  createSolanaRpc,
  type Address,
  type Rpc,
  type SolanaRpcApi,
  getSignatureFromTransaction,
} from 'gill';
import { ArcadeTokenOptions, ArcadeTokenCreationResult } from '@/types/token';
import { WalletAdapter } from '@/types/wallet';
import { createArcadeTokenInitTransaction, createMintToTransaction, getMintInfo, decimalAmountToRaw } from '@mosaic/sdk';

/**
 * Validates required fields for arcade token creation
 */
const validateRequiredFields = (options: ArcadeTokenOptions): void => {
  if (!options.name || !options.symbol) {
    throw new Error('Name and symbol are required');
  }
};

/**
 * Validates and parses decimals value
 */
const validateAndParseDecimals = (decimalsString: string): number => {
  const decimals = parseInt(decimalsString, 10);
  if (isNaN(decimals) || decimals < 0 || decimals > 9) {
    throw new Error('Decimals must be a number between 0 and 9');
  }
  return decimals;
};

/**
 * Validates wallet connection and returns signer address
 */
const validateWalletAndGetSignerAddress = (wallet: WalletAdapter): string => {
  const walletPublicKey = wallet.publicKey;
  if (!walletPublicKey) {
    throw new Error('Wallet not connected');
  }
  return walletPublicKey.toString();
};

/**
 * Sets up authorities with fallback to signer address
 */
const setupAuthorities = (
  options: ArcadeTokenOptions,
  signerAddress: string
): {
  mintAuthority: Address;
  metadataAuthority: Address;
  pausableAuthority: Address;
  confidentialBalancesAuthority: Address;
  permanentDelegateAuthority: Address;
} => {
  const mintAuthority = (options.mintAuthority || signerAddress) as Address;
  const metadataAuthority = (options.metadataAuthority ||
    mintAuthority) as Address;
  const pausableAuthority = (options.pausableAuthority ||
    mintAuthority) as Address;
  const confidentialBalancesAuthority = (options.confidentialBalancesAuthority ||
    mintAuthority) as Address;
  const permanentDelegateAuthority = (options.permanentDelegateAuthority ||
    mintAuthority) as Address;

  return {
    mintAuthority,
    metadataAuthority,
    pausableAuthority,
    confidentialBalancesAuthority,
    permanentDelegateAuthority,
  };
};

/**
 * Creates RPC client with default URL fallback
 */
const createRpcClient = (rpcUrl?: string): Rpc<SolanaRpcApi> => {
  const url = rpcUrl || 'https://api.devnet.solana.com';
  return createSolanaRpc(url);
};

/**
 * Creates an arcade token using the web-compatible version of the CLI script
 * @param options - Configuration options for the arcade token
 * @param wallet - Solana wallet instance
 * @returns Promise that resolves to the arcade token creation result
 */
export const createArcadeToken = async (
  options: ArcadeTokenOptions,
  wallet: WalletAdapter
): Promise<ArcadeTokenCreationResult> => {
  try {
    validateRequiredFields(options);
    const decimals = validateAndParseDecimals(options.decimals);
    const signerAddress = validateWalletAndGetSignerAddress(wallet);

    // Generate mint keypair
    const mintKeypair = await generateKeyPairSigner();

    // Set authorities (default to signer if not provided)
    const {
      mintAuthority,
      metadataAuthority,
      pausableAuthority,
      confidentialBalancesAuthority,
      permanentDelegateAuthority,
    } = setupAuthorities(options, signerAddress);

    // Create RPC client
    const rpc = createRpcClient(options.rpcUrl);

    // Create arcade token transaction using SDK
    const transaction = await createArcadeTokenInitTransaction(
      rpc,
      options.name,
      options.symbol,
      decimals,
      options.uri || '',
      mintAuthority,
      mintKeypair.address,
      signerAddress as Address,
      metadataAuthority,
      pausableAuthority,
      confidentialBalancesAuthority,
      permanentDelegateAuthority
    );

    // Sign the transaction
    const signedTransaction =
      await signTransactionMessageWithSigners(transaction);
    const signature = getSignatureFromTransaction(signedTransaction);

    // Return success result with all details
    return {
      success: true,
      transactionSignature: signature,
      mintAddress: mintKeypair.address,
      details: {
        name: options.name,
        symbol: options.symbol,
        decimals: decimals,
        mintAuthority: mintAuthority,
        metadataAuthority: metadataAuthority,
        pausableAuthority: pausableAuthority,
        confidentialBalancesAuthority: confidentialBalancesAuthority,
        permanentDelegateAuthority: permanentDelegateAuthority,
        extensions: [
          'Metadata',
          'Pausable',
          'Default Account State (Blocklist)',
          'Confidential Balances',
          'Permanent Delegate',
        ],
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Mints arcade token tokens to a recipient address
 * @param mintAddress - The mint address of the token
 * @param recipient - The recipient wallet address
 * @param amount - The decimal amount to mint (e.g., "1.5")
 * @param wallet - Solana wallet instance (used as mint authority and fee payer)
 * @param rpcUrl - Optional RPC URL
 * @returns Promise that resolves to the mint result
 */
export const mintArcadeToken = async (
  mintAddress: string,
  recipient: string,
  amount: string,
  wallet: WalletAdapter,
  rpcUrl?: string
): Promise<{ success: boolean; error?: string; transactionSignature?: string; amount?: string }> => {
  try {
    // Validate wallet connection
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    // Create RPC client
    const url = rpcUrl || 'https://api.devnet.solana.com';
    const rpc: Rpc<SolanaRpcApi> = createSolanaRpc(url);

    // Get mint information to determine decimals
    const mintInfo = await getMintInfo(rpc, mintAddress as Address);
    const decimals = mintInfo.decimals;

    // Parse and validate amount
    const decimalAmount = parseFloat(amount);
    if (isNaN(decimalAmount) || decimalAmount <= 0) {
      throw new Error('Amount must be a positive number');
    }

    // Convert decimal amount to raw amount
    const rawAmount = decimalAmountToRaw(decimalAmount, decimals);

    // Create mint transaction
    const transaction = await createMintToTransaction(
      rpc,
      mintAddress as Address,
      recipient as Address,
      rawAmount,
      wallet.publicKey as Address, // Use wallet as mint authority
      wallet.publicKey as Address  // Use wallet as fee payer
    );

    // Sign the transaction
    const signedTransaction = await signTransactionMessageWithSigners(transaction);
    const signature = getSignatureFromTransaction(signedTransaction);

    // Return success result
    return {
      success: true,
      transactionSignature: signature,
      amount: amount,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
