import { BigNumber, Contract, ContractFunction, ethers } from 'ethers';
import { useAsyncFn } from 'react-use';
import Web3Modal from 'web3modal';
import CanalStFun from '../../contracts/artifacts/CanalStFun.json';
import WalletConnectProvider from "@walletconnect/web3-provider";

type MakeReplicaFn = (
  originalTokenAddress: string,
  originalTokenId: string,
  replicaTokenURI: string,
  feeSplitRecipient: string,
  optionalComment: string,
) => Promise<{
  replicaTokenOwner: string;
  replicaTokenAddress: string;
  replicaTokenId: string;
}>;

export default function useMakeReplica() {
  const [makeReplicaState, makeReplica] = useAsyncFn(async (
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
    const signerAddress = await signer.getAddress();

    let canalStFunContract: CanalStFunContract;
    switch (chainId) {
      case 1:
        canalStFunContract = new ethers.Contract(process.env.NEXT_PUBLIC_CANAL_ST_FUN_CONTRACT_ADDRESS_ETHEREUM, CanalStFun.abi, signer) as CanalStFunContract;
        break;
      case 137:
        canalStFunContract = new ethers.Contract(process.env.NEXT_PUBLIC_CANAL_ST_FUN_CONTRACT_ADDRESS_POLYGON, CanalStFun.abi, signer) as CanalStFunContract;
        break;
      default:
        throw new Error('Almost there– but you\'re on the wrong network. Please switch to the Ethereum or Polygon network and then try again.');
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
    
    return {
      replicaTokenOwner: signerAddress,
      replicaTokenAddress: canalStFunContract.address,
      replicaTokenId,
    };
  }, []);

  // TODO: Add transaction ID so the user can view their pending transaction on a block scanner
  return {
    makeReplica,
    makeReplicaState,
  };
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