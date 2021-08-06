import React, { ReactElement, useCallback, useEffect, useState } from 'react';

type NFTInputUrlOrAddressProps = {
  onChangeValue: (value: { address?: string, tokenId?: string }) => void;
}

export function NFTInputUrlOrAddress({
  onChangeValue
}: NFTInputUrlOrAddressProps): ReactElement {
  const [urlOrAddress, setUrlOrAddress] = useState('');
  const onChangeInput = useCallback((e) => setUrlOrAddress(e.target.value), [setUrlOrAddress]);

  const { address, tokenId } = useNFTAddress(urlOrAddress);
  useEffect(() => {
    if (address) {
      onChangeValue({ address, tokenId });
    }
  }, [address, tokenId]);
  
  return (
    <input
      className="w-full p-4 bg-transparent bg-white bg-opacity-25 rounded-lg rounded-bl-none outline-none placeholder-green-50 focus:outline-white place holder-opacity-80"
      onChange={onChangeInput}
      placeholder="Paste NFT url or token address"
      value={urlOrAddress}
    />
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