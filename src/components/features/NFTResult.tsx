import React, { useCallback } from "react";
import { providerEthereum } from "../../constants/provider";
import useMakeReplica from "../../hooks/useMakeReplica";
import useMakeReplicaPrice from "../../hooks/useMakeReplicaPrice";
import useNFT from "../../hooks/useNFT";
import RemoteMediaPreview from "../views/RemoteMediaPreview";

export default function NFTResult({
  nftAddress,
  nftTokenId,
}) {
  const nftState = useNFT(nftAddress, nftTokenId);
  const ownerQuery = nftState.status === 'ready' && (nftState.ownerENSName || nftState.ownerAddress);
  const makeReplicaPriceState = useMakeReplicaPrice(nftState.status === 'ready' && nftState.resolvedProvider);
  const [makeReplicaState, makeReplica] = useMakeReplica();
  const onClickGetReplica = useCallback(() => {
    if (nftState.status === 'ready') {
      makeReplica(
        nftAddress,
        nftTokenId,
        nftState.metadataURI,
        nftState.ownerAddress ?? '0x0000000000000000000000000000000000000000',
        '',
      );
    } else {
      alert('Failed to make a replica of the NFT since it\'s status is '+ nftState.status +'. Try a different NFT or try again.');
    }
  }, [nftAddress, nftTokenId, makeReplica, nftState]);
  console.log('makeReplicaState', makeReplicaState);
  console.log('makeReplicaPriceState', makeReplicaPriceState);

  return (
    <div className="flex flex-col py-4 space-y-4">
      {nftState.status === 'loading' && (
        <div>Checking...</div>
      )}
      {nftState.status === 'ready' && (
        <>
          <RemoteMediaPreview
            className="self-center object-contain rounded-md w-28 h-28 md:w-40 md:h-40 lg:h-64 xl:h-96 lg:w-64 xl:w-96"
            mediaURI={nftState.mediaURI}
          />
          <div className="space-y-2">
            <div className="text-2xl">{nftState.name}</div>
            <div className="text-xs opacity-50">
              {nftState.resolvedProvider === providerEthereum ? 'Ethereum' : 'Polygon'}
            </div>
          </div>
          <button
            className="px-4 py-2 text-lg font-medium text-white bg-blue-500 rounded-lg shadow-xl lg:px-8 lg:py-4 lg:text-4xl lg:rounded-2xl hover:bg-blue-600 font-body"
            onClick={onClickGetReplica}
          >
            Get Replica for ${makeReplicaPriceState.value?.toFixed(2)} + gas
          </button>
          {nftState.ownerAddress && !nftState.ownerIsContract && (
            <div className="text-xs lg:text-sm">
              50% of payment will be sent to the NFT's current owner, <a href={`https://etherscan.io/enslookup-search?search=${encodeURIComponent(ownerQuery)}`} className="underline" target="_blank">{ownerQuery}</a>
            </div>
          )}
        </>
      )}
      {nftState.status === 'error' && (
        <div className="space-y-4">
          <div className="text-lg">Failed to load that NFT.</div>
          <div className="text-base">We can replicate any ERC721 or ERC1155 NFT. Try hitting "Switch NFT" below and pasting a url from Rarible, OpenSea, or Etherscan.</div>
          <div className="text-sm">If you pasted a URL to a real NFT, the NFT itself may not be on mainnet or polygon, or may have an incorrect metadata URL. Please try another.</div>
          <div className="text-xs text-gray-400">{nftState.error.message}</div>
        </div>
      )}
    </div>
  );
}