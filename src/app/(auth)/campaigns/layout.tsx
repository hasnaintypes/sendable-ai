import type { PropsWithChildren } from "react";

export default function CampaignsLayout({ children }: PropsWithChildren) {
  return (
    <div className={"flex flex-col flex-1 min-h-0 h-full"}>{children}</div>
  );
}
