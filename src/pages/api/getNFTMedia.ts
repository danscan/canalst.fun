import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'

/** API function to HEAD media files, circumventing CORS, and respond with their content-type */
export default async function getNFTMedia(req: NextApiRequest, res: NextApiResponse<string>) {
  const uri = decodeURIComponent(req.query.uri as string);
  const {
    headers: { 'content-type': contentType },
    data,
  } = await axios.get(uri, {
    responseType: 'stream',
  });

  res
    .status(200)
    .setHeader('content-type', contentType);
  
  data.pipe(res);
}