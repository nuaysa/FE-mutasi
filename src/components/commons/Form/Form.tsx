import { cva } from "class-variance-authority";
import { get } from "lodash";
import React from "react";
import { Controller, type FieldValues, type Path, type useForm } from "react-hook-form";
import { cn, formatPrice } from "@/utils/helpers";
import CustomDatePicker from "../DatePicker";
import { CSVUploadInput } from "./CSVInput";
import { ImageUpload } from "./ImageUpload";
import SelectField from "./SingleSelect";
import { Calendar, Eye, EyeClosed } from "lucide-react";

const fieldWrapper = cva("flex w-full", {
  variants: {
    layout: {
      row: "items-center",
      col: "flex-col gap-2",
    },
  },
  defaultVariants: {
    layout: "row",
  },
});

const labelClass = cva("text-sm font-bold text-neutral-gray1 text-left h-full", {
  variants: {
    width: {
      default: "w-full",
      custom: "",
    },
  },
  defaultVariants: {
    width: "default",
  },
});

const inputBase = cva("w-full py-2 px-3 border-2 rounded-md text-sm text-neutral-black focus:outline-none", {
  variants: {
    state: {
      normal: "border-neutral-gray2 focus:ring-primary-main",
      error: "border-semantic-red1 focus:ring-semantic-red1",
    },
  },
  defaultVariants: {
    state: "normal",
  },
});

export interface Field<T extends FieldValues> {
  name: Path<T>;
  label?: string | React.ReactElement;
  type: "text" | "password" | "date" | "price" | "select" | "custom" | "textarea" | "CSVFile" | "ImageUpload" | "ImageUploadButton" | "number";
  placeholder?: string;
  options?: { value: string; label: string }[];
  customComponent?: React.ReactNode;
  customWidth?: string;
  maxlength?: number;
  dateType?: "single" | "range";
  description?: string;
  disabled?: boolean;
  required?: boolean;
  validate?: (value: string | number | boolean, allValues: T) => true | string;
  loadMore?: () => void;
  hasMore?: boolean;
}

interface DynamicFormProps<T extends FieldValues> {
  fields: Field<T>[];
  form: ReturnType<typeof useForm<T>>;
  layout?: "row" | "col";
}

export default function DynamicForm<T extends FieldValues>({ fields, form, layout = "col" }: DynamicFormProps<T>) {
  const {
    control,
    register,
    formState: { errors },
  } = form;
  const [visiblePasswords, setVisiblePasswords] = React.useState<Record<string, boolean>>({});
  const [maxLengthWarnings, setMaxLengthWarnings] = React.useState<Record<string, boolean>>({});

  const togglePassword = (name: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className={cn("flex flex-col gap-4 w-full")}>
      {fields.map((field) => {
        const fieldError = get(errors, field.name);
        const errorState = fieldError ? "error" : "normal";
        return (
          <div key={field.name as string} className={fieldWrapper({ layout })}>
            <label
              htmlFor={field.name as string}
              className={cn(
                labelClass({
                  width: field.customWidth ? "custom" : "default",
                }),
                field.customWidth ? field.customWidth : "",
                field.label ? "block" : "hidden"
              )}
            >
              {field.label}
              {field.required && <span className="text-semantic-red1">*</span>}
            </label>
            <div className="flex-1 max-w-full overflow-x-hidden">
              {field.type === "text" && (
                <div className="flex flex-col">
                  <input
                    {...register(field.name, {
                      validate: field.validate ? (value) => field.validate?.(value, form.getValues()) : undefined,
                    })}
                    id={field.name as string}
                    type="text"
                    maxLength={field.maxlength}
                    placeholder={field.placeholder}
                    className={inputBase({ state: errorState })}
                    onChange={(e) => {
                      register(field.name).onChange(e);

                      const value = e.target.value;
                      if (field.maxlength) {
                        setMaxLengthWarnings((prev) => ({
                          ...prev,
                          [field.name]: value.length === field.maxlength,
                        }));
                      }
                      form.clearErrors(field.name);
                    }}
                  />
                  {maxLengthWarnings[field.name] && <p className="mt-1 text-xs text-neutral-gray1 italic">* Maksimal {field.maxlength} karakter.</p>}
                </div>
              )}

              {field.type === "password" && (
                <div className="relative">
                  <input
                    {...register(field.name, {
                      validate: field.validate ? (value) => field.validate?.(value, form.getValues()) : undefined,
                    })}
                    id={field.name as string}
                    type={visiblePasswords[field.name as string] ? "text" : "password"}
                    placeholder={field.placeholder}
                    className={inputBase({ state: errorState })}
                  />
                  <button type="button" onClick={() => togglePassword(field.name as string)} className="absolute inset-y-1 right-3 flex items-center text-sm">
                    {visiblePasswords[field.name as string] ? <Eye size={20} className="text-neutral-gray1" /> : <EyeClosed size={20} className="text-neutral-gray1" />}
                  </button>
                </div>
              )}

              {field.type === "number" && (
                <input
                  {...register(field.name, {
                    validate: field.validate ? (value) => field.validate?.(value, form.getValues()) : undefined,
                  })}
                  id={field.name as string}
                  type="number"
                  min={0}
                  placeholder={field.placeholder}
                  className={inputBase({ state: errorState })}
                />
              )}

  {field.type === "price" && (
  <Controller
    control={control}
    name={field.name}
    rules={{
      validate: field.validate
        ? (value) => field.validate?.(value, form.getValues())
        : undefined,
    }}
    render={({ field: controllerField }) => {
      const displayValue =
        controllerField.value !== undefined && controllerField.value !== null
          ? formatPrice(controllerField.value)
          : "";

      return (
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-sm font-bold text-neutral-black">
            Rp
          </span>

          <input
            type="text"
            inputMode="numeric"
            placeholder={field.placeholder}
            className={`${inputBase({ state: errorState })} pl-8`}
            value={displayValue}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/[^\d]/g, "");
              const numericValue = rawValue ? Number(rawValue) : undefined;

              controllerField.onChange(numericValue);
              form.clearErrors(field.name);
            }}
          />
        </div>
      );
    }}
  />
)}

              {field.type === "textarea" && (
                <textarea
                  {...register(field.name, {
                    validate: field.validate ? (value) => field.validate?.(value, form.getValues()) : undefined,
                  })}
                  placeholder={field.placeholder}
                  className={inputBase({ state: errorState })}
                />
              )}

              {field.type === "date" && (
                <Controller
                  control={control}
                  name={field.name}
                  rules={{
                    validate: field.validate ? (value) => field.validate?.(value, form.getValues()) : undefined,
                  }}
                  render={({ field: controllerField }) => (
                    <CustomDatePicker
                    defaultToday={ true}
                      isFutureDisabled={false}
                      placeholder={field.placeholder || "Choose Date"}
                      className={cn(inputBase({ state: errorState }), "pr-10 truncate")}
                      icon={<Calendar size={15} />}
                      mode={field.dateType || "single"}
                      value={controllerField.value}
                      onChange={(dateValue) => {
                        if (dateValue.start) {
                          controllerField.onChange(dateValue.start);
                        } else {
                          controllerField.onChange("");
                        }
                        form.clearErrors(field.name);
                      }}
                    />
                  )}
                />
              )}

              {field.type === "CSVFile" && (
                <Controller
                  control={control}
                  name={field.name}
                  rules={{
                    validate: field.validate ? (value) => field.validate?.(value, form.getValues()) : undefined,
                  }}
                  render={({ field: controllerField }) => (
                    <CSVUploadInput
                      value={controllerField.value}
                      onChange={(val) => {
                        controllerField.onChange(val);
                        form.clearErrors(field.name);
                      }}
                      placeholder={field.placeholder}
                      error={!!errors[field.name]}
                      description={field.description}
                    />
                  )}
                />
              )}

              {field.type === "ImageUpload" && (
                <Controller
                  control={control}
                  name={field.name}
                  rules={{
                    validate: field.validate ? (value) => field.validate?.(value, form.getValues()) : undefined,
                  }}
                  render={({ field: controllerField }) => (
                    <ImageUpload
                      value={controllerField.value}
                      onChange={(val) => {
                        controllerField.onChange(val);
                        form.clearErrors(field.name);
                      }}
                      error={!!errors[field.name]}
                      description={field.description}
                    />
                  )}
                />
              )}

              {field.type === "ImageUploadButton" && (
                <Controller
                  control={control}
                  name={field.name}
                  rules={{
                    validate: field.validate ? (value) => field.validate?.(value, form.getValues()) : undefined,
                  }}
                  render={({ field: controllerField }) => (
                    <ImageUpload
                      value={controllerField.value}
                      onChange={(val) => {
                        controllerField.onChange(val);
                        form.clearErrors(field.name);
                      }}
                      error={!!errors[field.name]}
                      description={field.description}
                      isButtonStyle={true}
                    />
                  )}
                />
              )}

              {field.type === "select" && (
                <Controller
                  control={control}
                  name={field.name}
                  rules={{
                    validate: field.validate ? (value) => field.validate?.(value, form.getValues()) : undefined,
                  }}
                  render={({ field: controllerField }) => (
                    <SelectField
                      options={
                        field.options?.map((opt) => ({
                          value: opt.value,
                          label: opt.label,
                        })) ?? []
                      }
                      error={!!fieldError}
                      disabled={field.disabled}
                      value={controllerField.value}
                      onChange={(val) => {
                        controllerField.onChange(val);
                        form.clearErrors(field.name);
                      }}
                      placeholder={field.placeholder}
                    />
                  )}
                />
              )}

              {field.type === "custom" && field.customComponent}

              {field.description && !errors[field.name] && <p className="mt-1 text-xs text-neutral-gray1 italic">* {field.description}</p>}

              {fieldError && <p className={cn("mt-1 text-xs italic", fieldError?.type === "max-50" ? "text-neutral-gray1" : "text-semantic-red1")}>{fieldError?.message?.toString()}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
