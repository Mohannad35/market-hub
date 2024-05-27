import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Modify } from "@/lib/types";
import { CouponValues } from "@/lib/validation/coupon-schema";
import { Input, InputProps, Tooltip } from "@nextui-org/react";
import React from "react";
import { UseFormReturn } from "react-hook-form";

type Props = Modify<
  InputProps,
  { name: string; form: UseFormReturn<CouponValues>; tooltip: string }
>;
const FormInput = ({ form, tooltip, value, ...props }: Props) => {
  return (
    <FormField
      control={form.control}
      name={props.name as keyof CouponValues}
      render={({ field: { value, ...field } }) => (
        <FormItem className="w-full">
          <FormControl>
            <Tooltip content={tooltip} delay={1000} placement="top-start" size="lg">
              <div>
                <Input
                  isInvalid={
                    form.formState.errors[props.name as keyof typeof form.formState.errors]
                      ? true
                      : false
                  }
                  errorMessage={(
                    form.formState.errors[props.name as keyof typeof form.formState.errors]
                      ?.message as string
                  )
                    ?.split("\n")
                    .map((msg, i) => <p key={i}>{msg}</p>)}
                  value={value?.toString()}
                  {...field}
                  {...props}
                />
              </div>
            </Tooltip>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default FormInput;
