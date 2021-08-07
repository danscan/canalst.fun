import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'

/** API function to HEAD media files, circumventing CORS, and respond with their content-type */
export default async function getMediaContentType(req: NextApiRequest, res: NextApiResponse<string>) {
  const uri = decodeURIComponent(req.query.uri as string);
  const { headers: { 'content-type': mediaContentType } } = await axios.head(uri);

  res
    .status(200)
    .send(mediaContentType);
}