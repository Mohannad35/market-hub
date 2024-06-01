"use client";

import { getProduct } from "@/lib/query-functions/product";
import { getRate, getRatingStats } from "@/lib/query-functions/rate";
import { ProductWithBrandAndCategoryAndRates, RateWithUser } from "@/lib/types";
import { Icon as Iconify } from "@iconify/react";
import { AvatarIcon } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Input, Textarea } from "@nextui-org/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Progress } from "@nextui-org/progress";
import { useDisclosure } from "@nextui-org/use-disclosure";
import { User } from "@nextui-org/user";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { createReview } from "./sendReview";
import Rating from "@/components/common/Rating";

const ProductRates = ({ slug }: { slug: string }) => {
  const { status } = useSession();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { data, error, isSuccess, isLoading, isRefetching, refetch } =
    useQuery<ProductWithBrandAndCategoryAndRates>({
      queryKey: ["product", slug],
      queryFn: getProduct,
      staleTime: 1000 * 60 * 10, // 10 minutes
    });
  const ratingStats = useQuery<{ _count: number; rate: number }[]>({
    queryKey: ["rate", slug],
    queryFn: getRatingStats,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
  const userRating = useQuery<RateWithUser>({
    queryKey: ["rate", null, slug],
    queryFn: getRate,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  if (isLoading || isRefetching || ratingStats.isLoading || userRating.isLoading) return <></>;
  else if (error || ratingStats.error || userRating.error)
    return (
      <div className="container">
        Error: {error?.message} {ratingStats.error?.message} {userRating.error?.message}
      </div>
    );
  else if (!isSuccess || !data || !ratingStats.data)
    return <div className="container">No data</div>;

  const { id, rating, ratingCount, rates } = data;

  const handleSubmit = async (formData: FormData) => {
    onClose();
    const promise = new Promise((resolve, reject) =>
      createReview(formData, id)
        .then(data => {
          if (data.error) reject(new Error(data.error.message));
          resolve(data);
        })
        .catch(reject)
    );
    toast.promise(promise, {
      loading: "Sending review...",
      success() {
        refetch();
        userRating.refetch();
        ratingStats.refetch();
        return "Review sent";
      },
      error(error) {
        return error.message;
      },
    });
  };
  return (
    <Flex direction="column" pb="9" gapY="6">
      <Divider />
      <Flex direction={{ initial: "column", md: "row" }} gapX="8">
        <Flex
          direction="column"
          width={{ initial: "100%", md: "25rem" }}
          minWidth={{ initial: "100%", md: "25rem" }}
        >
          <Card className="gap-3 p-6" fullWidth>
            <Flex gapX="2" justify="start" align="center">
              <Iconify icon="solar:star-bold" fontSize={24} color="#f5a524" />
              <Text size="4">
                {rating}{" "}
                <span className="text-muted-foreground">• (Based on {ratingCount} reviews)</span>
              </Text>
            </Flex>

            <Flex direction="column" gapY="3">
              {[5, 4, 3, 2, 1].map((value, i) => {
                const count = ratingStats.data.find(val => val.rate === value)?._count || 0;
                const percentFilled = (count / (ratingCount || 1)) * 100;
                return (
                  <Progress
                    key={i}
                    label={value + " stars"}
                    value={percentFilled}
                    color="warning"
                    showValueLabel={true}
                  />
                );
              })}
            </Flex>

            {status === "authenticated" && (
              <Button
                variant="bordered"
                radius="full"
                onPress={onOpen}
                startContent={<Iconify icon="solar:pen-bold" />}
                className="mt-3"
              >
                {userRating.data ? "Edit your review" : "Write a review"}
              </Button>
            )}

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <form action={handleSubmit}>
                <ModalContent className="font-inter">
                  <ModalHeader className="flex flex-col">
                    <Text className="text-lg font-medium">Write a review</Text>
                    <Text className="text-sm font-light text-muted-foreground">
                      Share your experience with this product
                    </Text>
                  </ModalHeader>
                  <ModalBody>
                    <Rating name="rating" defaultValue={userRating.data?.rate || 1} />
                    <Input
                      isRequired
                      name="title"
                      type="text"
                      variant="bordered"
                      label="Title"
                      placeholder="Title of your review"
                      startContent={<Iconify icon="solar:pen-bold" />}
                      defaultValue={userRating.data?.title || undefined}
                    />
                    <Textarea
                      isRequired
                      name="comment"
                      label="Review"
                      variant="bordered"
                      placeholder="Write your review here"
                      classNames={{ input: "resize-y" }}
                      defaultValue={userRating.data?.comment || undefined}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button type="submit" color="primary" fullWidth>
                      Send review
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </form>
            </Modal>
          </Card>
        </Flex>

        <Flex width="100%" direction="column" gapY="6">
          <Text size="4" weight="medium">
            {ratingCount} Reviews
          </Text>

          {rates.map(({ rate, comment, title, createdAt, user }, index) => (
            <Flex key={index} direction="column" gapY="6" justify="start">
              {index !== 0 && <Divider className="my-2" />}
              <Flex direction="column" gapY="4">
                <Flex direction="row" justify="between">
                  <User
                    name={user.name}
                    description={
                      <Text>Reviewed in Egypt on {new Date(createdAt).toDateString()}</Text>
                    }
                    avatarProps={{
                      src: user.image?.secure_url || undefined,
                      showFallback: true,
                      fallback: <AvatarIcon />,
                      size: "sm",
                    }}
                    classNames={{ base: "flex justify-start items-center" }}
                  />
                  <Rating readOnly defaultValue={rate} />
                </Flex>

                <Flex direction="column" gapY="2">
                  {title && <Text size="3">{title}</Text>}
                  {comment && (
                    <Text size="3" className="text-muted-foreground">
                      {comment}
                    </Text>
                  )}
                </Flex>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProductRates;
