import { BigNumber, Contract, ContractFunction, ethers } from 'ethers';
import { useAsyncFn } from 'react-use';
import Web3Modal from 'web3modal';
import CanalStFun from '../../contracts/artifacts/CanalStFun.json';
import WalletConnectProvider from "@walletconnect/web3-provider";

export default function useMakeReplica() {
  return useAsyncFn(async (
    originalTokenAddress: string,
    originalTokenId: string,
    replicaTokenURI: string,
    feeSplitRecipient: string,
    optionalComment: string,
  ) => {
    const web3Modal = new Web3Modal({
      cacheProvider: false,
      network: 'mainnet',
      theme: 'dark',
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: { infuraId: process.env.NEXT_PUBLIC_INFURA_ID },
        },
      },
    });
    web3Modal.clearCachedProvider();
    const web3Provider = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(web3Provider);
    const network = await provider.getNetwork();
    const { chainId } = network;
    const signer = provider.getSigner();

    let canalStFunContract: CanalStFunContract;
    switch (chainId) {
      case 1:
        canalStFunContract = new ethers.Contract(process.env.NEXT_PUBLIC_CANAL_ST_FUN_CONTRACT_ADDRESS_ETHEREUM, CanalStFun.abi, signer) as CanalStFunContract;
        break;
      case 137:
        canalStFunContract = new ethers.Contract(process.env.NEXT_PUBLIC_CANAL_ST_FUN_CONTRACT_ADDRESS_POLYGON, CanalStFun.abi, signer) as CanalStFunContract;
        break;
      default:
        throw new Error('Wrong network. Please use the Ethereum (1) or Polygon (137) chain.');
    }
    
    const canalStFunMakeReplicaPrice = await canalStFunContract.makeReplicaPrice();
    
    const replicaTokenId = await canalStFunContract.makeReplica(
      originalTokenAddress,
      originalTokenId,
      replicaTokenURI,
      ethers.utils.getAddress(feeSplitRecipient),
      optionalComment,
      { value: canalStFunMakeReplicaPrice }
    );
    console.log('replicaTokenId', replicaTokenId);
  }, []);
}

type CanalStFunContract = InstanceType<typeof Contract> & {
  makeReplicaPrice: ContractFunction<BigNumber>;
  makeReplica: (
    originalTokenAddress: string,
    originalTokenId: string,
    replicaTokenURI?: string,
    feeSplitRecipient?: string,
    optionalComment?: string,
    overrides?: any,
  ) => Promise<BigNumber>;
}