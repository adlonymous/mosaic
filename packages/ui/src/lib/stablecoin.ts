import {
  signTransactionMessageWithSigners,
  generateKeyPairSigner,
  createSolanaRpc,
  type Address,
  type Rpc,
  type SolanaRpcApi,
  getSignatureFromTransaction,
} from 'gill';
import { StablecoinOptions, StablecoinCreationResult } from '@/types/token';
import { WalletAdapter } from '@/types/wallet';
import { createStablecoinInitTransaction, createMintToTransaction, getMintInfo, decimalAmountToRaw } from '@mosaic/sdk';

/**
 * Creates a stablecoin using the web-compatible version of the CLI script
 * @param options - Configuration options for the stablecoin
 * @param wallet - Solana wallet instance
 * @returns Promise that resolves to the stablecoin creation result
 */
export const createStablecoin = async (
  options: StablecoinOptions,
  wallet: WalletAdapter
): Promise<StablecoinCreationResult> => {
  try {
    // Validate required fields
    if (!options.name || !options.symbol) {
      throw new Error('Name and symbol are required');
    }

    // Parse decimals
    const decimals = parseInt(options.decimals, 10);
    if (isNaN(decimals) || decimals < 0 || decimals > 9) {
      throw new Error('Decimals must be a number between 0 and 9');
    }

    // Get wallet public key
    const walletPublicKey = wallet.publicKey;
    if (!walletPublicKey) {
      throw new Error('Wallet not connected');
    }

    const signerAddress = walletPublicKey.toString();

    // Generate mint keypair
    const mintKeypair = await generateKeyPairSigner();

    // Set authorities (default to signer if not provided)
    const mintAuthority = (options.mintAuthority || signerAddress) as Address;
    const metadataAuthority = (options.metadataAuthority ||
      mintAuthority) as Address;
    const pausableAuthority = (options.pausableAuthority ||
      mintAuthority) as Address;
    const confidentialBalancesAuthority =
      (options.confidentialBalancesAuthority || mintAuthority) as Address;
    const permanentDelegateAuthority = (options.permanentDelegateAuthority ||
      mintAuthority) as Address;

    // Create RPC client
    const rpcUrl = options.rpcUrl || 'https://api.devnet.solana.com';
    const rpc: Rpc<SolanaRpcApi> = createSolanaRpc(rpcUrl);

    // Create stablecoin transaction using SDK
    const transaction = await createStablecoinInitTransaction(
      rpc,
      options.name,
      options.symbol,
      decimals,
      options.uri || '',
      mintAuthority,
      mintKeypair,
      wallet.publicKey as Address, // Use wallet as fee payer
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
 * Mints stablecoin tokens to a recipient address
 * @param mintAddress - The mint address of the token
 * @param recipient - The recipient wallet address
 * @param amount - The decimal amount to mint (e.g., "1.5")
 * @param wallet - Solana wallet instance (used as mint authority and fee payer)
 * @param rpcUrl - Optional RPC URL
 * @returns Promise that resolves to the mint result
 */
export const mintStablecoin = async (
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
