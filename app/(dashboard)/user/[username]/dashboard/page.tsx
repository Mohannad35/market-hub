import { Flex } from "@radix-ui/themes";
import ProductsChart from "./ProductsChart";
import { auth, signIn } from "@/auth";

export default async function ProductDetailsPage() {
  const session = await auth();
  if (!session) return await signIn();

  return (
    <div className="container">
      <Flex direction="column" width="100%" gap="2" align="start" justify="start">
        {session.user.role === "admin" && <ProductsChart />}
      </Flex>
    </div>
  );
}
