import { Transition } from '@headlessui/react';
import Image from 'next/image';
import React, { PropsWithChildren, ReactElement, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNft } from 'use-nft';

interface NFTFormProps {
  onAskForNFT: (contractAddress: string, tokenId: string) => Promise<void>;
}

export default function NFTForm({ onAskForNFT }: NFTFormProps): ReactElement {
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm();
  const onSubmit = useCallback((data) => {
    onAskForNFT(data.contractAddress, data.tokenId);
  }, []);

  const watchUrlOrContractAddress = watch('urlOrContractAddress');
  const watchTokenId = watch('tokenId');

  const { address, tokenId } = useNFTAddress(watchUrlOrContractAddress);
  const { error, status, nft } = useNft(address, tokenId);
  console.log(error);


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="block space-y-4">
      {/* NFT Url Or Contract Address */}
      <Transition
        appear
        show={!address}
        enter="transition-all duration-500 ease-out"
        enterFrom="opacity-0"
        enterTo="opacity-1000"
        leave="transition-all duration-500 ease-out"
        leaveFrom="opacity-1000"
        leaveTo="opacity-0"
      >
        <InputGroup label={`Paste a url from OpenSea or Rarible, or a token address – e.g, "0x..."`}>
          <input
            {...register('urlOrContractAddress')}
            className="w-full p-4 bg-transparent bg-white bg-opacity-25 rounded-lg rounded-bl-none outline-none placeholder-green-50 focus:outline-white place holder-opacity-80"
            placeholder="NFT url or token address"
          />
        </InputGroup>
      </Transition>
      {/* NFT Token ID */}
      <Transition
        appear
        show={address && !tokenId}
        enter="transition-all duration-500 ease-out"
        enterFrom="opacity-0"
        enterTo="opacity-1000"
        leave="transition-all duration-500 ease-out"
        leaveFrom="opacity-1000"
        leaveTo="opacity-0"
      >
        <InputGroup label={`Enter a token id for ${address}`}>
          <input
            {...register('tokenId')}
            className="w-full p-4 bg-transparent bg-white bg-opacity-25 rounded-lg rounded-bl-none outline-none placeholder-green-50 focus:outline-white place holder-opacity-80"
            placeholder="Token ID"
          />
        </InputGroup>
      </Transition>
      {/* NFT */}
      {nft && (
        <>
        <img src={nft.image} className="w-auto h-40 rounded-md" />
        <div className="flex items-stretch space-x-4">
          <button className="p-4 text-base text-gray-200 bg-gray-600 rounded-lg font-style-ipm" onClick={onResetAddressInputValue}>
            Reset
          </button>
          {/* Ask Vendor */}
          <button className="p-4 bg-green-900 rounded-lg">
            <span className="text-sm text-gray-200 font-style-ipm">Ask </span>
            <span className="text-lg italic font-semibold text-white lg:text-2xl font-body">
              "Do you have this one?"
            </span>
          </button>
        </div>
        </>
      )}
    </form>
  );
}

type InputGroupProps = PropsWithChildren<{
  label: string;
}>;

function InputGroup({
  children,
  label,
}: InputGroupProps): ReactElement {
  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="text-sm font-medium tracking-wider text-white font-style-ipm opacity-60">
        {label}
      </div>
      {/* Control */}
      {children}
    </div>
  );
}

type UseNFTAddressReturnType = {
  address: string | null;
  tokenId: string | null;
};

export function useNFTAddress(inputValue: string): UseNFTAddressReturnType {
  const [, address] = inputValue?.match(/(0x[a-fA-F0-9]{40})/) ?? [];
  const [,, tokenId] = inputValue?.match(/(0x[a-fA-F0-9]{40})(?:[/|:, ]{1,2}|\?[a-zA-Z0-9]+=)([0-9]{1,77})/) ?? [];

  return {
    address,
    tokenId,
  };
}