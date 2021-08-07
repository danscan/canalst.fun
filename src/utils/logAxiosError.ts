import { AxiosError } from "axios";

export default function logAxiosError(error: AxiosError) {
  if (error.response) {
    // Request made and server responded
    console.log('AxiosError response.data', error.response.data);
    console.log('AxiosError response.status', error.response.status);
    console.log('AxiosError response.headers', error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // console.log('AxiosError request', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
}
