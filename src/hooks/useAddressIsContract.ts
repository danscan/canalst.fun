import { utils } from "ethers";
import { useEffect, useState } from "react";

/*
  ~ What it does? ~
  Checks whether a contract exists on the blockchain, returns true if it exists, otherwise false
  ~ How can I use? ~
  const contractIsDeployed = useContractExistsAtAddress(localProvider, contractAddress);
  ~ Features ~
  - Provide contractAddress to check if the contract is deployed
  - Change provider to check contract address on different chains (ex. mainnetProvider)
*/

export default function useAddressIsContract(provider, contractAddress) {
  const [contractIsDeployed, setContractIsDeployed] = useState(false);

  // We can look at the blockchain and see what's stored at `contractAddress`
  // If we find code then we know that a contract exists there.
  // If we find nothing (0x0) then there is no contract deployed to that address
  useEffect(() => {
    // eslint-disable-next-line consistent-return
    const checkDeployment = async () => {
      if (!utils.isAddress(contractAddress)) return false;
      const bytecode = await provider.getCode(contractAddress);
      console.log('bytecode', bytecode);
      setContractIsDeployed(!['0x', '0x0'].includes(bytecode));
    };
    if (provider) checkDeployment();
  }, [provider, contractAddress]);

  return contractIsDeployed;
};
