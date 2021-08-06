import { ethers } from "ethers";

export const providerEthereum = new ethers.providers.InfuraProvider('homestead', process.env.NEXT_PUBLIC_INFURA_ID);
export const providerPolygon = new ethers.providers.JsonRpcProvider('https://polygon-mainnet.infura.io/v3/'+ process.env.NEXT_PUBLIC_INFURA_ID);
