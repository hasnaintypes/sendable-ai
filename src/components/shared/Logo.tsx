import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  showTitle?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const sizeMap = {
  sm: { image: 24, container: "size-6" },
  md: { image: 32, container: "size-8" },
  lg: { image: 40, container: "size-10" },
} as const;

export function Logo({
  href,
  showTitle = true,
  showSubtitle = false,
  subtitle = "Email Outreach",
  size = "md",
  className,
  titleClassName,
  subtitleClassName,
}: LogoProps) {
  const { image, container } = sizeMap[size];

  const content = (
    <>
      <div
        className={cn(
          "flex items-center justify-center rounded-lg overflow-hidden shrink-0",
          container,
        )}
      >
        <Image
          src="/icons/sendable-logo.png"
          alt="Sendable"
          width={image}
          height={image}
          className="w-full h-full object-contain"
        />
      </div>
      {(showTitle || showSubtitle) && (
        <div className="grid text-left leading-tight">
          {showTitle && (
            <span
              className={cn(
                "truncate font-semibold text-foreground",
                size === "lg" && "text-lg",
                size === "sm" && "text-sm",
                titleClassName,
              )}
            >
              Sendable
            </span>
          )}
          {showSubtitle && (
            <span
              className={cn(
                "truncate text-xs text-muted-foreground",
                subtitleClassName,
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </>
  );

  const wrapperClassName = cn("flex items-center gap-2", className);

  if (href) {
    return (
      <Link href={href} className={wrapperClassName}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClassName}>{content}</div>;
}
