import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import logAxiosError from '../../utils/logAxiosError';

/** API function to HEAD media files, circumventing CORS, and respond with their content-type */
export default async function getMediaContentType(req: NextApiRequest, res: NextApiResponse<string>) {
  const uri = req.query.uri as string;

  try {
    const { headers: { 'content-type': mediaContentType } } = await axios.head(uri);
  
    res
      .status(200)
      .send(mediaContentType);
  } catch (error) {
    logAxiosError(error);
    res
      .status(200)
      .send('');
  }
}