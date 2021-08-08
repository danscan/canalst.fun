import axios from "axios";
import classNames from "classnames";
import { ReactElement, useCallback, useState } from "react";
import { useAsync } from "react-use";

enum MediaPreviewAttempt {
  OriginalMedia = 0,
  ProxiedMedia = 1,
  OriginalIframe = 2,
  LinkOnly = 3,
};

type RemoteMediaPreviewProps = {
  className?: string;
  mediaURI: string;
};

export default function RemoteMediaPreview({
  className,
  mediaURI,
}: RemoteMediaPreviewProps): ReactElement {
  const mediaContentTypeAsync = useAsync(async () => {
    const { data: contentType } = await axios.get('/api/getMediaContentType', { params: { uri: mediaURI } });
    return contentType;
  }, [mediaURI]);
  const [mediaPreviewAttempt, setMediaPreviewAttempt] = useState<MediaPreviewAttempt>(MediaPreviewAttempt.OriginalMedia);
  const onLoadFailed = useCallback(() => {
    // Only increment attempt until the last option is exhausted
    setMediaPreviewAttempt((prevAttempt) => {
      return prevAttempt >= MediaPreviewAttempt.LinkOnly
        ? prevAttempt
        : prevAttempt + 1;
    });
  }, []);

  if (mediaContentTypeAsync.loading) {
    return null;
  }

  const [contentTypeType] = mediaContentTypeAsync.value.split('/');
  let MediaComponent: 'img' | 'video' | 'iframe';
  switch (contentTypeType) {
    case 'image':
      MediaComponent = 'img';
      break;
    case 'video':
      MediaComponent = 'video';
      break;
    case 'document':
    default:
      MediaComponent = 'iframe';
      break;
  }

  switch (mediaPreviewAttempt) {
    case MediaPreviewAttempt.OriginalMedia:
      return <MediaComponent className={className} src={mediaURI} onError={onLoadFailed} />;
    case MediaPreviewAttempt.ProxiedMedia:
      return <MediaComponent className={className} src={`/api/getRemoteAsset?uri=${encodeURIComponent(mediaURI)}`} onError={onLoadFailed} />;
    case MediaPreviewAttempt.OriginalIframe:
      return <iframe className={className} src={mediaURI} onError={onLoadFailed} />;
    case MediaPreviewAttempt.LinkOnly:
    default:
      return <a className={classNames(className, 'block border border-white text-white underline p-4')} href={mediaURI}>Click to view NFT media</a>;
  }
}