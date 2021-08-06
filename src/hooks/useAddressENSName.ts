import { utils } from "ethers";
import { useEffect, useState } from "react";

// resolved if(name){} to not save "" into cache

/*
  ~ What it does? ~
  Gets ENS name from given address and provider
  ~ How can I use? ~
  const ensName = useLookupAddress(mainnetProvider, address);
  ~ Features ~
  - Provide address and get ENS name corresponding to given address
*/

const lookupAddress = async (provider, address) => {
  if (address && utils.isAddress(address)) {
    // console.log(`looking up ${address}`)
    try {
      // Accuracy of reverse resolution is not enforced.
      // We then manually ensure that the reported ens name resolves to address
      const reportedName = await provider.lookupAddress(address);

      const resolvedAddress = await provider.resolveName(reportedName);

      if (address && utils.getAddress(address) === utils.getAddress(resolvedAddress)) {
        return reportedName;
      }
      return utils.getAddress(address);
    } catch (e) {
      return utils.getAddress(address);
    }
  }
  return 0;
};

export default function useAddressENSName(provider, address) {
  const [ensName, setEnsName] = useState<string>(address);

  useEffect(() => {
    const cacheString = window.localStorage.getItem("ensCache_" + address);
    const cache = cacheString && JSON.parse(cacheString);

    if (cache && cache.timestamp > Date.now()) {
      setEnsName(cache.name);
    } else if (provider) {
      lookupAddress(provider, address).then(name => {
        if (name) {
          setEnsName(name);
          window.localStorage.setItem(
            "ensCache_" + address,
            JSON.stringify({
              timestamp: Date.now() + 360000,
              name,
            }),
          );
        }
      });
    }
  }, [provider, address, setEnsName]);

  return ensName;
};
