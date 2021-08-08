import { BigNumber, Contract, ContractFunction, ethers } from 'ethers';
import { useAsync } from 'react-use';
import CanalStFunABI from '../abis/CanalStFunABI.json';
import ChainlinkPriceFeedABI from '../abis/ChainlinkPriceFeedABI.json';
import { providerEthereum, providerPolygon } from '../constants/provider';

export default function useMakeReplicaPrice(resolvedProvider: ethers.providers.BaseProvider) {
  return useAsync(async () => {
    if (!resolvedProvider) {
      return null;
    }

    const network = await resolvedProvider.getNetwork();
    const { chainId } = network;

    let canalStFunContract: CanalStFunContract;
    let chainNativeTokenPriceContract: ChainlinkPriceFeedContract;
    switch (chainId) {
      case 1:
        canalStFunContract = new ethers.Contract(process.env.NEXT_PUBLIC_CANAL_ST_FUN_CONTRACT_ADDRESS_ETHEREUM, CanalStFunABI, providerEthereum) as CanalStFunContract;
        chainNativeTokenPriceContract = new ethers.Contract(process.env.NEXT_PUBLIC_CHAINLINK_PRICE_FEED_ADDRESS_ETH, ChainlinkPriceFeedABI, providerEthereum) as ChainlinkPriceFeedContract;
        break;
      case 137:
        canalStFunContract = new ethers.Contract(process.env.NEXT_PUBLIC_CANAL_ST_FUN_CONTRACT_ADDRESS_POLYGON, CanalStFunABI, providerPolygon) as CanalStFunContract;
        chainNativeTokenPriceContract = new ethers.Contract(process.env.NEXT_PUBLIC_CHAINLINK_PRICE_FEED_ADDRESS_MATIC, ChainlinkPriceFeedABI, providerEthereum) as ChainlinkPriceFeedContract;
        break;
      default:
        throw new Error('Wrong network. Please use the Ethereum (1) or Polygon (137) chain.');
    }
    
    const [
      canalStFunMakeReplicaPrice, // native token
      chainNativeTokenPrice, // usd+e8
      chainNativeTokenPriceDecimals // e8,
    ] = await Promise.all([
      canalStFunContract.makeReplicaPrice(),
      chainNativeTokenPriceContract.latestAnswer(),
      chainNativeTokenPriceContract.decimals(),
    ]);

    const chainNativeTokenPriceUSD = Number(ethers.utils.formatUnits(chainNativeTokenPrice, chainNativeTokenPriceDecimals));
    const canalStPriceNative = Number(ethers.utils.formatEther(canalStFunMakeReplicaPrice));
    const canalStPriceUSD = chainNativeTokenPriceUSD * canalStPriceNative;

    return canalStPriceUSD;
  }, [resolvedProvider]);
}

type CanalStFunContract = InstanceType<typeof Contract> & {
  makeReplicaPrice: ContractFunction<BigNumber>;
}

type ChainlinkPriceFeedContract = InstanceType<typeof Contract> & {
  decimals: ContractFunction<number>;
  latestAnswer: ContractFunction<BigNumber>;
}
