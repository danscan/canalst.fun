import axios from 'axios';
import { Contract, ContractFunction, providers } from 'ethers';
import { ReactElement } from 'react';
import { useAsync } from 'react-use';
import { providerEthereum, providerPolygon } from '../constants/provider';
import ipfsUrlFromString from '../utils/ipfsUrl';

type UseNFTReturnType = 
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'ready' } & UseNFTResultType;

type UseNFTResultType = {
  description?: string;
  mediaElement: ReactElement;
  name?: string;
  ownerAddress: string;
  ownerENSName: string | null;
  ownerIsContract: boolean;
  resolvedProvider: providers.BaseProvider;
};

export default function useNFT(tokenAddress: string, tokenId: string | number): UseNFTReturnType {
  const {
    loading,
    error,
    value: result,
  } = useAsync(async (): Promise<UseNFTResultType> => {
    const {
      nftMetadata,
      ownerAddress,
      ownerENSName,
      ownerIsContract,
      provider: resolvedProvider,
    } = await resolveNFT(tokenAddress, tokenId);

    const nftMediaUri = ipfsUrlFromString(nftMetadata.image ?? nftMetadata.imageUrl ?? nftMetadata.image_url ?? nftMetadata.animation_url);
    const { headers: { 'content-type': nftMediaMime } } = await axios.head(nftMediaUri);
    
    const mediaElement = (() => {
      if (nftMediaMime.startsWith('image/')) {
        return <img src={nftMediaUri} className="self-center w-auto h-40 rounded-md lg:h-64 xl:h-96" />;
      }

      if (nftMediaMime.startsWith('document/')) {
        return <iframe src={nftMediaUri} className="self-center w-auto h-40 rounded-md lg:h-64 xl:h-96" />;
      }

      return <video src={nftMediaUri} className="self-center w-40 h-40 rounded-md lg:h-64 xl:h-96 lg:w-64 xl:w-96" autoPlay controls />;
    })();

    return {
      description: nftMetadata.description,
      mediaElement,
      name: nftMetadata.name,
      ownerAddress,
      ownerENSName,
      ownerIsContract,
      resolvedProvider,
    };
  }, [tokenAddress, tokenId]);

  if (error) {
    return { status: 'error', error };
  }

  if (loading) {
    return { status: 'loading' };
  }

  return {
    status: 'ready',
    ...result,
  };
}

type ResolveNFTReturnType = {
  provider: providers.BaseProvider;
  ownerAddress?: string;
  ownerENSName?: string;
  ownerIsContract?: boolean;
  nftMetadata: {
    animation_url?: string; // opensea standard
    description?: string; // standard
    image?: string; // standard
    image_url?: string; // nonstandard
    imageUrl?: string; // nonstandard
    name?: string; // standard
  }
};

/** Helper for fetching the nft metadata and owner */
async function resolveNFT(
  tokenAddress: string,
  tokenId: string | number,
  provider: providers.BaseProvider = providerEthereum,
): Promise<ResolveNFTReturnType> {
  const nftContract = new Contract(tokenAddress, NFTABI, provider) as NFTContract;

  const [
    erc721URI,
    erc1155URI,
  ] = await Promise.all([
    nftContract.tokenURI(tokenId).catch((error) => console.warn('tokenURI error', error)),
    nftContract.uri(tokenId).catch((error) => console.warn('uri error', error)),
  ]);
  const metadataURI = erc721URI || erc1155URI;

  if (!metadataURI) {
    if (provider !== providerPolygon) {
      console.warn('token not found... trying polygon');
      return resolveNFT(tokenAddress, tokenId, providerPolygon);
    } else {
      throw new Error('Token not found');
    }
  }

  let ownerAddress: string | undefined;
  let ownerENSName: string | undefined;
  let ownerIsContract: boolean | undefined;
  if (erc721URI) {
    ownerAddress = await nftContract.ownerOf(tokenId);

    // Check whether owner address is a contract
    const bytecode = await provider.getCode(ownerAddress);
    ownerIsContract = !['0x', '0x0'].includes(bytecode);
  
    // Get owner ENS name
    ownerENSName = await provider.lookupAddress(ownerAddress);
  }

  // Fetch NFT metadata
  const { data } = await axios.get(ipfsUrlFromString(metadataURI));
  const nftMetadata = data as ResolveNFTReturnType['nftMetadata'];

  return {
    provider,
    ownerAddress,
    ownerENSName, 
    ownerIsContract,
    nftMetadata,
  };
}

const NFTABI = [
  // ERC721
  'function tokenURI(uint256 _tokenId) external view returns (string)',
  'function ownerOf(uint256 _tokenId) external view returns (address)',
  // ERC1155
  'function uri(uint256 _id) external view returns (string)',
];

type NFTContract = InstanceType<typeof Contract> & {
  ownerOf: ContractFunction<string>;
  tokenURI: ContractFunction<string>;
  uri: ContractFunction<string>;
}