import { ReactNode } from "react";

export default function ProductLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="container pt-4">{children}</div>;
}
