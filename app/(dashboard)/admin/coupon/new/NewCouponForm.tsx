"use client";

import { Form } from "@/components/ui/form";
import { useMutationHook } from "@/hook/use-tanstack-hooks";
import { useZodValidationResolver } from "@/lib/utils";
import { CouponValues, createCouponSchema } from "@/lib/validation/coupon-schema";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Button } from "@nextui-org/button";
import { Coupon } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormDatePicker from "../FormDatePicker";
import FormInput from "../FormInput";

const NewCouponForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const addCouponMutation = useMutationHook<Coupon, CouponValues>("/api/coupon", ["addCoupon"]);
  const form = useForm<CouponValues>({
    resolver: useZodValidationResolver(createCouponSchema),
    defaultValues: {},
    mode: "onTouched",
  });

  async function onSubmit(data: CouponValues) {
    const promise = new Promise<Coupon>(async (resolve, reject) =>
      addCouponMutation.mutateAsync(data).then(resolve).catch(reject)
    );
    toast.promise(promise, {
      pending: "Adding coupon...",
      success: {
        render: ({ data }) => {
          setTimeout(() => {
            router.push(pathname.replace(/\/new.*/, ""));
            router.refresh();
          }, 2000);
          return `${data.code} has been added`;
        },
      },
      error: {
        render: ({ data }: { data: Error }) => data.message || "An unexpected error occurred",
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

          <Button type="submit" color="primary" isLoading={addCouponMutation.isPending}>
            <Text size="3" weight="medium">
              Add Coupon
            </Text>
          </Button>
        </Flex>
      </form>
    </Form>
  );
};

export default NewCouponForm;
