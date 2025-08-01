/**
 * This code was AUTOGENERATED using the codama library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun codama to update it.
 *
 * @see https://github.com/codama-idl/codama
 */

import {
  combineCodec,
  fixDecoderSize,
  fixEncoderSize,
  getAddressDecoder,
  getAddressEncoder,
  getBytesDecoder,
  getBytesEncoder,
  getProgramDerivedAddress,
  getStructDecoder,
  getStructEncoder,
  transformEncoder,
  type AccountMeta,
  type AccountSignerMeta,
  type Address,
  type FixedSizeCodec,
  type FixedSizeDecoder,
  type FixedSizeEncoder,
  type Instruction,
  type InstructionWithAccounts,
  type InstructionWithData,
  type ReadonlyAccount,
  type ReadonlyUint8Array,
  type TransactionSigner,
  type WritableAccount,
  type WritableSignerAccount,
} from '@solana/kit';
import { ABL_SRFC37_PROGRAM_ADDRESS } from '../programs';
import {
  expectAddress,
  expectSome,
  getAccountMetaFactory,
  type ResolvedAccount,
} from '../shared';

export const ADD_WALLET_TO_LIST_DISCRIMINATOR = new Uint8Array([
  249, 25, 0, 35, 88, 124, 60, 201,
]);

export function getAddWalletToListDiscriminatorBytes() {
  return fixEncoderSize(getBytesEncoder(), 8).encode(
    ADD_WALLET_TO_LIST_DISCRIMINATOR
  );
}

export type AddWalletToListInstruction<
  TProgram extends string = typeof ABL_SRFC37_PROGRAM_ADDRESS,
  TAccountAuthority extends string | AccountMeta<string> = string,
  TAccountListConfig extends string | AccountMeta<string> = string,
  TAccountAbWallet extends string | AccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | AccountMeta<string> = '11111111111111111111111111111111',
  TRemainingAccounts extends readonly AccountMeta<string>[] = [],
> = Instruction<TProgram> &
  InstructionWithData<ReadonlyUint8Array> &
  InstructionWithAccounts<
    [
      TAccountAuthority extends string
        ? WritableSignerAccount<TAccountAuthority> &
            AccountSignerMeta<TAccountAuthority>
        : TAccountAuthority,
      TAccountListConfig extends string
        ? ReadonlyAccount<TAccountListConfig>
        : TAccountListConfig,
      TAccountAbWallet extends string
        ? WritableAccount<TAccountAbWallet>
        : TAccountAbWallet,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      ...TRemainingAccounts,
    ]
  >;

export type AddWalletToListInstructionData = {
  discriminator: ReadonlyUint8Array;
  wallet: Address;
};

export type AddWalletToListInstructionDataArgs = { wallet: Address };

export function getAddWalletToListInstructionDataEncoder(): FixedSizeEncoder<AddWalletToListInstructionDataArgs> {
  return transformEncoder(
    getStructEncoder([
      ['discriminator', fixEncoderSize(getBytesEncoder(), 8)],
      ['wallet', getAddressEncoder()],
    ]),
    value => ({ ...value, discriminator: ADD_WALLET_TO_LIST_DISCRIMINATOR })
  );
}

export function getAddWalletToListInstructionDataDecoder(): FixedSizeDecoder<AddWalletToListInstructionData> {
  return getStructDecoder([
    ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
    ['wallet', getAddressDecoder()],
  ]);
}

export function getAddWalletToListInstructionDataCodec(): FixedSizeCodec<
  AddWalletToListInstructionDataArgs,
  AddWalletToListInstructionData
> {
  return combineCodec(
    getAddWalletToListInstructionDataEncoder(),
    getAddWalletToListInstructionDataDecoder()
  );
}

export type AddWalletToListAsyncInput<
  TAccountAuthority extends string = string,
  TAccountListConfig extends string = string,
  TAccountAbWallet extends string = string,
  TAccountSystemProgram extends string = string,
> = {
  authority: TransactionSigner<TAccountAuthority>;
  listConfig: Address<TAccountListConfig>;
  abWallet?: Address<TAccountAbWallet>;
  systemProgram?: Address<TAccountSystemProgram>;
  wallet: AddWalletToListInstructionDataArgs['wallet'];
};

export async function getAddWalletToListInstructionAsync<
  TAccountAuthority extends string,
  TAccountListConfig extends string,
  TAccountAbWallet extends string,
  TAccountSystemProgram extends string,
  TProgramAddress extends Address = typeof ABL_SRFC37_PROGRAM_ADDRESS,
>(
  input: AddWalletToListAsyncInput<
    TAccountAuthority,
    TAccountListConfig,
    TAccountAbWallet,
    TAccountSystemProgram
  >,
  config?: { programAddress?: TProgramAddress }
): Promise<
  AddWalletToListInstruction<
    TProgramAddress,
    TAccountAuthority,
    TAccountListConfig,
    TAccountAbWallet,
    TAccountSystemProgram
  >
> {
  // Program address.
  const programAddress = config?.programAddress ?? ABL_SRFC37_PROGRAM_ADDRESS;

  // Original accounts.
  const originalAccounts = {
    authority: { value: input.authority ?? null, isWritable: true },
    listConfig: { value: input.listConfig ?? null, isWritable: false },
    abWallet: { value: input.abWallet ?? null, isWritable: true },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
  };
  const accounts = originalAccounts as Record<
    keyof typeof originalAccounts,
    ResolvedAccount
  >;

  // Original args.
  const args = { ...input };

  // Resolve default values.
  if (!accounts.abWallet.value) {
    accounts.abWallet.value = await getProgramDerivedAddress({
      programAddress,
      seeds: [
        getAddressEncoder().encode(expectAddress(accounts.listConfig.value)),
        getAddressEncoder().encode(expectSome(args.wallet)),
      ],
    });
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value =
      '11111111111111111111111111111111' as Address<'11111111111111111111111111111111'>;
  }

  const getAccountMeta = getAccountMetaFactory(programAddress, 'programId');
  const instruction = {
    accounts: [
      getAccountMeta(accounts.authority),
      getAccountMeta(accounts.listConfig),
      getAccountMeta(accounts.abWallet),
      getAccountMeta(accounts.systemProgram),
    ],
    programAddress,
    data: getAddWalletToListInstructionDataEncoder().encode(
      args as AddWalletToListInstructionDataArgs
    ),
  } as AddWalletToListInstruction<
    TProgramAddress,
    TAccountAuthority,
    TAccountListConfig,
    TAccountAbWallet,
    TAccountSystemProgram
  >;

  return instruction;
}

export type AddWalletToListInput<
  TAccountAuthority extends string = string,
  TAccountListConfig extends string = string,
  TAccountAbWallet extends string = string,
  TAccountSystemProgram extends string = string,
> = {
  authority: TransactionSigner<TAccountAuthority>;
  listConfig: Address<TAccountListConfig>;
  abWallet: Address<TAccountAbWallet>;
  systemProgram?: Address<TAccountSystemProgram>;
  wallet: AddWalletToListInstructionDataArgs['wallet'];
};

export function getAddWalletToListInstruction<
  TAccountAuthority extends string,
  TAccountListConfig extends string,
  TAccountAbWallet extends string,
  TAccountSystemProgram extends string,
  TProgramAddress extends Address = typeof ABL_SRFC37_PROGRAM_ADDRESS,
>(
  input: AddWalletToListInput<
    TAccountAuthority,
    TAccountListConfig,
    TAccountAbWallet,
    TAccountSystemProgram
  >,
  config?: { programAddress?: TProgramAddress }
): AddWalletToListInstruction<
  TProgramAddress,
  TAccountAuthority,
  TAccountListConfig,
  TAccountAbWallet,
  TAccountSystemProgram
> {
  // Program address.
  const programAddress = config?.programAddress ?? ABL_SRFC37_PROGRAM_ADDRESS;

  // Original accounts.
  const originalAccounts = {
    authority: { value: input.authority ?? null, isWritable: true },
    listConfig: { value: input.listConfig ?? null, isWritable: false },
    abWallet: { value: input.abWallet ?? null, isWritable: true },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
  };
  const accounts = originalAccounts as Record<
    keyof typeof originalAccounts,
    ResolvedAccount
  >;

  // Original args.
  const args = { ...input };

  // Resolve default values.
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value =
      '11111111111111111111111111111111' as Address<'11111111111111111111111111111111'>;
  }

  const getAccountMeta = getAccountMetaFactory(programAddress, 'programId');
  const instruction = {
    accounts: [
      getAccountMeta(accounts.authority),
      getAccountMeta(accounts.listConfig),
      getAccountMeta(accounts.abWallet),
      getAccountMeta(accounts.systemProgram),
    ],
    programAddress,
    data: getAddWalletToListInstructionDataEncoder().encode(
      args as AddWalletToListInstructionDataArgs
    ),
  } as AddWalletToListInstruction<
    TProgramAddress,
    TAccountAuthority,
    TAccountListConfig,
    TAccountAbWallet,
    TAccountSystemProgram
  >;

  return instruction;
}

export type ParsedAddWalletToListInstruction<
  TProgram extends string = typeof ABL_SRFC37_PROGRAM_ADDRESS,
  TAccountMetas extends readonly AccountMeta[] = readonly AccountMeta[],
> = {
  programAddress: Address<TProgram>;
  accounts: {
    authority: TAccountMetas[0];
    listConfig: TAccountMetas[1];
    abWallet: TAccountMetas[2];
    systemProgram: TAccountMetas[3];
  };
  data: AddWalletToListInstructionData;
};

export function parseAddWalletToListInstruction<
  TProgram extends string,
  TAccountMetas extends readonly AccountMeta[],
>(
  instruction: Instruction<TProgram> &
    InstructionWithAccounts<TAccountMetas> &
    InstructionWithData<ReadonlyUint8Array>
): ParsedAddWalletToListInstruction<TProgram, TAccountMetas> {
  if (instruction.accounts.length < 4) {
    // TODO: Coded error.
    throw new Error('Not enough accounts');
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts![accountIndex]!;
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      authority: getNextAccount(),
      listConfig: getNextAccount(),
      abWallet: getNextAccount(),
      systemProgram: getNextAccount(),
    },
    data: getAddWalletToListInstructionDataDecoder().decode(instruction.data),
  };
}
