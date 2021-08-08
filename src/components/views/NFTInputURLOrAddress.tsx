import React, { ReactElement, useCallback, useEffect, useState } from 'react';

type NFTInputURLOrAddressProps = {
  className: string,
  onChangeValue: (value: { address?: string, tokenId?: string }) => void;
}

export default function NFTInputURLOrAddress({
  className,
  onChangeValue,
}: NFTInputURLOrAddressProps): ReactElement {
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
      className={className}
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

function useNFTAddress(inputValue: string): UseNFTAddressReturnType {
  const [, address] = inputValue?.match(/(0x[a-fA-F0-9]{40})/) ?? [];
  const [,, tokenId] = inputValue?.match(/(0x[a-fA-F0-9]{40})(?:[/|:, ]{1,2}|\?[a-zA-Z0-9]+=)([0-9]{1,77})/) ?? [];

  return {
    address,
    tokenId,
  };
}