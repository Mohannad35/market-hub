"use client";

import LoadingIndicator from "@/components/common/LoadingIndicator";
import { Form } from "@/components/ui/form";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { getCoupon } from "@/lib/query-functions/coupon";
import { useZodValidationResolver } from "@/lib/utils";
import { CouponValues, editCouponSchema } from "@/lib/validation/coupon-schema";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { Coupon } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { isEqual, pick } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormDatePicker from "../../FormDatePicker";
import FormInput from "../../FormInput";

const EditCouponForm = ({ code }: { code: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const editCouponMutation = useMutationHook<Coupon, Partial<CouponValues>>(
    `/api/coupon/${code}`,
    ["addCoupon"],
    "PATCH"
  );
  const { data, error, isSuccess, isLoading } = useQuery<Coupon>({
    queryKey: ["getCouponEdit", code],
    queryFn: getCoupon,
  });
  const form = useForm<CouponValues>({
    resolver: useZodValidationResolver(editCouponSchema),
    defaultValues: {},
    mode: "onTouched",
  });

  useEffect(() => {
    if (data) {
      form.reset({
        code: data.code,
        value: data.value.toString(),
        startDate: data.startDate,
        endDate: data.endDate,
        name: data.name || undefined,
        description: data.description || undefined,
        minAmount: data.minAmount.toString(),
        maxAmount: data.maxAmount ? data.maxAmount.toString() : undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isLoading) return <LoadingIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!isSuccess || !data) return <Text>Coupon not found</Text>;

  async function onSubmit(values: CouponValues) {
    const differences = data
      ? Object.keys(values).filter(key => {
          if (key === "startDate" || key === "endDate") {
            return !isEqual(
              new Date(values[key as "startDate" | "endDate"]),
              new Date(data[key as "startDate" | "endDate"])
            );
          }
          return !isEqual(
            values[key as keyof typeof values],
            data[key as keyof typeof data]?.toString()
          );
        })
      : Object.keys(values);
    if (differences.length < 1) return toast.error("No changes detected");
    const promise = new Promise<Coupon>(async (resolve, reject) =>
      editCouponMutation.mutateAsync(pick(values, differences)).then(resolve).catch(reject)
    );
    toast.promise(promise, {
      loading: "Editing coupon...",
      success(data) {
        setTimeout(() => {
          router.back();
          router.refresh();
        }, 2000);
        return `${data.code} has been updated`;
      },
      error(error) {
        return error.message || error || "An unexpected error occurred";
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Flex direction="column" gap="4" align="start">
          <Text size="7" weight="medium">
            New Coupon
          </Text>
          {/* code, endDate, startDate, value, description, maxAmount, minAmount, name */}

          <FormInput
            isRequired
            form={form}
            name="code"
            tooltip="Code"
            placeholder="Code"
            variant="bordered"
            type="text"
          />

          <FormInput
            isRequired
            form={form}
            name="value"
            tooltip="Value"
            placeholder="Value"
            variant="bordered"
            type="number"
          />

          <Flex width="100%" justify="between" gap="4">
            <FormDatePicker
              form={form}
              name="startDate"
              tooltip="Start Date"
              variant="bordered"
              minValue={today(getLocalTimeZone())}
              maxValue={today(getLocalTimeZone()).add({ months: 3 })}
            />

            <FormDatePicker
              form={form}
              name="endDate"
              tooltip="End Date"
              variant="bordered"
              minValue={today(getLocalTimeZone())}
              maxValue={today(getLocalTimeZone()).add({ months: 3 })}
            />
          </Flex>

          <FormInput
            form={form}
            name="name"
            tooltip="Name"
            placeholder="Name"
            variant="bordered"
            type="text"
          />

          <FormInput
            form={form}
            name="description"
            tooltip="Description"
            placeholder="Description"
            variant="bordered"
            type="text"
          />

          <FormInput
            form={form}
            name="minAmount"
            tooltip="Min Amount"
            placeholder="Min Amount"
            variant="bordered"
            type="number"
          />

          <FormInput
            form={form}
            name="maxAmount"
            tooltip="Max Amount"
            placeholder="Max Amount"
            variant="bordered"
            type="number"
          />

          <Button
            type="submit"
            color="primary"
            isLoading={editCouponMutation.isPending}
            isDisabled={!form.formState.isValid}
          >
            <Text size="3" weight="medium">
              Edit Coupon
            </Text>
          </Button>
        </Flex>
      </form>
    </Form>
  );
};

export default EditCouponForm;
