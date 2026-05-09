import { Space_Grotesk } from "next/font/google";
import type { PropsWithChildren } from "react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export default function CampaignsLayout({ children }: PropsWithChildren) {
  return (
    <div className={`${spaceGrotesk.variable} flex flex-col flex-1 min-h-0 h-full`}>
      {children}
    </div>
  );
}
