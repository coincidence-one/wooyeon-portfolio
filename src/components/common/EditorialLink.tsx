import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface EditorialLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  external?: boolean;
}

export const EditorialLink = ({
  children,
  external = false,
  className,
  ...rest
}: EditorialLinkProps) => {
  return (
    <a
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cn(
        'link-underline inline-flex items-center gap-0.5 text-ink',
        className
      )}
      {...rest}
    >
      <span>{children}</span>
      {external ? (
        <ArrowUpRight className="h-[1em] w-[1em] shrink-0 opacity-60" />
      ) : null}
    </a>
  );
};
