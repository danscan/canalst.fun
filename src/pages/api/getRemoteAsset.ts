import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import logAxiosError from '../../utils/logAxiosError';

/** API function to proxy remote assets, circumventing CORS, and redirect on request errors */
export default async function getNFTMedia(req: NextApiRequest, res: NextApiResponse<string>) {
  const uri = req.query.uri as string;

  try {
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
  } catch (error) {
    logAxiosError(error);
    res
      .status(301)
      .redirect(uri);
  }
}