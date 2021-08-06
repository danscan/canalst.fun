import 'tailwindcss/tailwind.css';
import '../styles/app.css';

export default function CustomApp({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  );
}
