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
  mediaURI: string;
  metadataURI: string;
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
      metadata,
      metadataURI,
      ownerAddress,
      ownerENSName,
      ownerIsContract,
      provider: resolvedProvider,
    } = await resolveNFT(tokenAddress, tokenId);

    const mediaURI = ipfsUrlFromString(metadata.image ?? metadata.imageUrl ?? metadata.image_url ?? metadata.animation_url);

    return {
      description: metadata.description,
      mediaURI,
      metadataURI,
      name: metadata.name,
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
  metadataURI: string;
  metadata: {
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
    nftContract.tokenURI(tokenId)
      .catch((error) => console.warn('tokenURI error', error)),
    nftContract.uri(tokenId)
      .catch((error) => console.warn('uri error', error)),
  ]);
  console.log('erc721URI', erc721URI);
  console.log('erc1155URI', erc1155URI);
  const metadataURI = erc721URI || erc1155URI;
  console.log('metadataURI', metadataURI);

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
    console.log('getting ownerAddress...');
    ownerAddress = await nftContract.ownerOf(tokenId)
      .catch((error) => console.warn('ownerOf error', error)) || undefined;
    console.log('ownerAddress', ownerAddress);

    if (ownerAddress) {
      // Check whether owner address is a contract
      console.log('checking ownerAddress code...');
      const bytecode = await provider.getCode(ownerAddress);
      console.log('bytecode', bytecode);
      ownerIsContract = !['0x', '0x0'].includes(bytecode);
      console.log('ownerIsContract', ownerIsContract);
    
      // Get owner ENS name (mainnet only)
      if (provider !== providerPolygon) {
        console.log('getting owner ENS name...');
        ownerENSName = await provider.lookupAddress(ownerAddress);
        console.log('ownerENSName', ownerENSName);
      }
    }
  }

  // Fetch NFT metadata
  console.log('fetching metadata from', ipfsUrlFromString(metadataURI));
  const { data } = await axios.get('/api/getRemoteAsset', { params: { uri: ipfsUrlFromString(metadataURI) } });
  console.log('data', data);
  const metadata = data as ResolveNFTReturnType['metadata'];

  return {
    provider,
    ownerAddress,
    ownerENSName, 
    ownerIsContract,
    metadata,
    metadataURI,
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
