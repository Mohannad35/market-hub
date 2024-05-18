"use client";

import { useQueryHook } from "@/hook/use-tanstack-hooks";
import { Flex, Text } from "@radix-ui/themes";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ProductsChart = () => {
  const { data, error, isLoading } = useQueryHook<{ products: number; month: string }[]>(
    "/api/stats/product",
    ["stats", "product"]
  );

  if (isLoading) return <></>;
  else if (error) return <div>Error: {error.message}</div>;
  else if (!data) return <div>No data</div>;
  return (
    <Flex direction="column" width="40rem" height="20rem" align="center" gapY="2">
      <Text size="5" weight="medium">
        New Products in the last year
      </Text>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            label={{ value: "Product", angle: -90 }}
          />
          <Tooltip
            cursor={false}
            itemStyle={{
              color: "hsl(var(--foreground))",
              backgroundColor: "hsl(var(--background))",
            }}
            contentStyle={{ backgroundColor: "hsl(var(--background))" }}
          />
          <Bar
            dataKey="products"
            style={{ fill: "hsl(var(--foreground))" }}
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Flex>
  );
};

export default ProductsChart;
