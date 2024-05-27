import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Modify } from "@/lib/types";
import { CouponValues } from "@/lib/validation/coupon-schema";
import { fromDate, getLocalTimeZone, toCalendarDate } from "@internationalized/date";
import { DatePicker, DatePickerProps, Input, InputProps, Tooltip } from "@nextui-org/react";
import React from "react";
import { UseFormReturn } from "react-hook-form";

type Props = Modify<
  DatePickerProps,
  { name: string; form: UseFormReturn<CouponValues>; tooltip: string }
>;
const FormDatePicker = ({ form, tooltip, ...props }: Props) => {
  return (
    <FormField
      control={form.control}
      name={props.name as keyof CouponValues}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl>
            <Tooltip content={tooltip} delay={1000} placement="top-start" size="lg">
              <div>
                <DatePicker
                  showMonthAndYearPickers
                  selectorButtonProps={{ size: "md" }}
                  classNames={{ selectorIcon: "text-primary-500 text-2xl" }}
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
                  value={
                    field.value
                      ? toCalendarDate(fromDate(new Date(field.value), getLocalTimeZone()))
                      : undefined
                  }
                  onChange={date => {
                    field.onChange(new Date(date.toDate(getLocalTimeZone())));
                  }}
                  isDisabled={field.disabled}
                  onBlur={field.onBlur}
                  ref={field.ref}
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

export default FormDatePicker;
