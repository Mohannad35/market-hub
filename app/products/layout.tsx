import { ReactNode } from "react";

export default function ProductLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="container pt-4">
      {/* <ScrollArea className="h-[calc(100vh-81px)] w-full rounded-none pt-4">{children}</ScrollArea> */}
      {children}
    </div>
  );
}
