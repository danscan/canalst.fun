import classNames from 'classnames';
import React, { ReactElement } from 'react';

interface ProgressBarProps {
  className: string;
  classNameValueIncomplete: string;
  classNameValueComplete: string;
  /** number between 0 and 1 */
  progress: number;
}

export default function ProgressBar({
  className,
  classNameValueIncomplete,
  classNameValueComplete,
  progress,
}: ProgressBarProps): ReactElement {
  return (
    <div className={className}>
      <div className={classNames("absolute inset-y-0 transition-all duration-700 delay-100 ease-out", {
        [classNameValueIncomplete]: progress < 1,
        [classNameValueComplete]: progress === 1,
      })} style={{ width: `${Math.ceil(100 * progress)}%`}} />
    </div>
  );
}
