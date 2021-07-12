import { ethers } from 'ethers';
import React, { ReactElement, useCallback } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import Web3Modal from 'web3modal';
import man from '../assets/metaverse-man.png';
import CanalStItem from '../../artifacts/contracts/CanalStItem.sol/CanalStItem.json';

export default function GreetingForm(): ReactElement {
  const { handleSubmit, register } = useForm();
  const onSubmit = useCallback(async ({
    tokenAddress,
    tokenId,
  }) => {
    const web3Modal = new Web3Modal({
      cacheProvider: true,
      theme: 'dark',
      providerOptions: {
        // Example with injected providers
        injected: {
          display: {
            logo: "data:image/gif;base64,INSERT_BASE64_STRING",
            name: "Injected",
            description: "Connect with the provider in your Browser"
          },
          package: null
        },
        // Example with WalletConnect provider
        // walletconnect: {
        //   display: {
        //     logo: "data:image/gif;base64,INSERT_BASE64_STRING",
        //     name: "Mobile",
        //     description: "Scan qrcode with your mobile wallet"
        //   },
        //   package: WalletConnectProvider,
        //   options: {
        //     infuraId: "INFURA_ID" // required
        //   }
        // },
      }
    });
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()

    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CANAL_ST_ITEM_CONTRACT_ADDRESS, CanalStItem.abi, signer);
    const pendingTransaction = await contract.makeReplica(tokenAddress, tokenId);
    const tx = await pendingTransaction.wait();
    console.log('tx', tx);

    alert(`created replica`);
  }, []);

  return (
    <div className="fixed inset-0 flex items-end space-x-4 lg:p-8 lg:justify-center lg:items-center">
      <div className="fixed inset-x-auto lg:flex-shrink-0 animate-float inset-y-10 lg:relative">
        <Image src={man} />
      </div>
      <div className="flex flex-col items-stretch p-8 space-y-8 text-2xl font-bold text-white scale-y-75 bg-green-800 lg:p-12 rounded-3xl font-body">
        <div>We got "authentic" NFT. Enter an NFT URL and lemme see if we got it in stock:</div>
        <form className="flex flex-col w-full space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <input {...register('tokenAddress')} className="flex-1 px-4 text-2xl font-bold text-center text-white placeholder-green-200 bg-green-800 border-b border-dashed outline-none font-style-ipm focus:outline-white" placeholder="NFT address" />
          <input {...register('tokenId')} className="flex-1 px-4 text-2xl font-bold text-center text-white placeholder-green-200 bg-green-800 border-b border-dashed outline-none font-style-ipm focus:outline-white" placeholder="NFT token id" />
          <input {...register('tip', { value: '0.0023' })} className="flex-1 px-4 text-2xl font-bold text-center text-white placeholder-green-200 bg-green-800 border-b border-dashed outline-none font-style-ipm focus:outline-white" placeholder="optional tip in ether" />
          <input className="px-8 py-3 font-bold text-yellow-300 bg-pink-500 shadow-xl rounded-2xl bg-gradient-to-br from-purple-400 to font-style-cn" type="submit" value="Get Replica" />
        </form>
      </div>
    </div>
  );
}