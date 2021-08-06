export function ipfsUrlDefault(cid: string, path = ""): string {
  return `https://ipfs.io/ipfs/${cid}${path}`
}

const IPFS_PROTOCOL_RE = /^ipfs:\/\/(?:ipfs\/)?([^/]+)(\/.+)?$/
const IPFS_HASH_RE = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/

export default function ipfsUrlFromString(
  ipfsString: string,
): string {
  // ipfs:// URI
  const ipfsProtocolMatch = IPFS_PROTOCOL_RE.exec(ipfsString)
  if (ipfsProtocolMatch) {
    const [, cid, path = ""] = ipfsProtocolMatch
    return ipfsUrlDefault(cid, path)
  }

  // standalone cid, probably
  if (IPFS_HASH_RE.test(ipfsString)) {
    return ipfsUrlDefault(ipfsString)
  }

  // maybe URL
  return ipfsString
}
