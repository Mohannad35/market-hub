import React from "react";

const ProductDetailsPage = ({ params: { slug } }: { params: { slug: string } }) => {
  return <div className="container">{slug}</div>;
};

export default ProductDetailsPage;
