import React from "react";

const VerifyEmailPage = ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  console.log(searchParams?.token);
  return <div>VerifyEmailPage</div>;
};

export default VerifyEmailPage;
