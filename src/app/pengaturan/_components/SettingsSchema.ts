import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const settingsSchema = yup.object({
  name: yup.string().required("wajib diisi").defined(),
});

export type SettingFormValue = yup.InferType<typeof settingsSchema>;

export const useSettingForm = () => {
  return useForm<SettingFormValue>({
    resolver: yupResolver(settingsSchema),
    defaultValues: {
      name: "",
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });
};
