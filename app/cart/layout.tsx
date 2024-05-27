import React from "react";

const CartLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <div className="p-4">{children}</div>;
};

export default CartLayout;
