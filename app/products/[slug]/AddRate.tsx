"use client";

import MuiRating from "@/components/common/Rating";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { getRate } from "@/lib/query-functions/rate";
import { ProductWithBrandAndCategoryAndRates } from "@/lib/types";
import { getFormDataObject, validateSchema } from "@/lib/utils";
import { stringMinMaxSchema } from "@/lib/validation-schemas";
import { Button, Textarea } from "@nextui-org/react";
import { Rate } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface AddRateProps {
  productId: string;
  refetchProduct: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<ProductWithBrandAndCategoryAndRates, Error>>;
}

const AddRate = ({ productId, refetchProduct }: AddRateProps) => {
  const [rating, setRating] = useState(0);
  const addRateMutation = useMutationHook<Rate>("/api/rates", ["newRate"]);
  const { data, error, isLoading } = useQuery<ProductWithBrandAndCategoryAndRates>({
    queryKey: ["rate", productId],
    queryFn: getRate,
  });

  const handleSubmit = async (formData: FormData) => {
    const body = getFormDataObject<{ rating: string; comment: string }>(formData);
    const { rating, comment } = body;
    const promise = new Promise<Rate>(async (resolve, reject) =>
      addRateMutation.mutateAsync({ rate: rating, comment, productId }).then(resolve).catch(reject)
    );
    toast.promise(promise, {
      loading: "Rating...",
      success() {
        setRating(0);
        refetchProduct();
        return `Product has been rated`;
      },
      error(error: Error) {
        return error.message || "An unexpected error occurred";
      },
    });
  };

  if (isLoading) return <></>;
  else if (error) return <div>Error: {error.message}</div>;
  else if (!data)
    return (
      <form action={handleSubmit} className="w-full">
        <Flex direction="column" gap="4" align="start" width="100%">
          <MuiRating rating={rating} setRateing={setRating} readOnly={false} precision={1} />

          <Textarea
            isRequired
            variant="bordered"
            name="comment"
            label="Write a review"
            type="text"
            validate={value => validateSchema(value, stringMinMaxSchema("Name", 2, 10_000))}
            errorMessage={valid => valid.validationErrors}
          />

          <Button type="submit" color="primary" isLoading={addRateMutation.isPending}>
            <Text size="3" weight="medium">
              Add Rate
            </Text>
          </Button>
        </Flex>
      </form>
    );
  return <></>;
};

export default AddRate;
