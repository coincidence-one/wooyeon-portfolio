import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface PhoneFrameProps {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

/** 스크린샷을 휴대폰 테두리 안에 넣는다 */
export const PhoneFrame = ({
  src,
  alt,
  className,
  eager = false,
}: PhoneFrameProps) => {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[1.6rem] border-[5px] border-[#1c1a17] bg-white shadow-[0_18px_40px_-18px_rgb(0_0_0/0.45)]',
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        className="block w-full"
      />
    </div>
  );
};

export interface BrowserFrameProps {
  url: string;
  children: ReactNode;
  className?: string;
}

/** 스크린샷을 브라우저 창 모양 안에 넣는다 */
export const BrowserFrame = ({ url, children, className }: BrowserFrameProps) => {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-line-strong bg-white shadow-[0_24px_50px_-28px_rgb(0_0_0/0.45)]',
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-[#e6e2d8] bg-[#f3f0e9] px-3.5 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#d5cfc2]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#d5cfc2]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#d5cfc2]" />
        </span>
        <span className="truncate text-xs text-[#736d62]">{url}</span>
      </div>
      {children}
    </div>
  );
};
