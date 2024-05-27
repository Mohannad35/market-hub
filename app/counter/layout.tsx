import { ReactNode } from "react";

export default function CounterLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="container pt-4">
      {/* <ScrollArea className="h-[calc(100vh-70px)] w-full rounded-none pt-4">{children}</ScrollArea> */}
      {children}
    </div>
  );
}
