import { BigNumber, Contract, ContractFunction, ethers } from 'ethers';
import { useAsyncFn } from 'react-use';
import Web3Modal from 'web3modal';
import CanalStFun from '../../contracts/artifacts/CanalStFun.json';

export default function useMakeReplica() {
  return useAsyncFn(async (
    originalTokenAddress: string,
    originalTokenId: string,
    replicaTokenURI: string,
    feeSplitRecipient: string,
    optionalComment: string,
  ) => {
    const web3Modal = new Web3Modal({

      theme: 'dark',
    });
    const web3Provider = await web3Modal.connect();
    console.log('web3Provider', web3Provider);
    const provider = new ethers.providers.Web3Provider(web3Provider);
    const network = await provider.getNetwork();
    console.log('network', network);
    const { chainId } = network;
    console.log('chainId', chainId);
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