import { yupResolver } from "@hookform/resolvers/yup";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { login } from "@/api/auth";
import type { Field } from "@/components/commons/Form/Form";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export const loginSchema = yup.object({
  email: yup.string().required("* Email wajib diisi").email("* Format email yang anda masukkan tidak valid"),
  password: yup.string().required("* Password wajib diisi"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

export const useLoginForm = () => {
  return useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    reValidateMode: "onBlur",
  });
};

export function useLoginViewModel() {
  const { showToast } = useToast();
  const { afterSuccessLogin } = useAuthContext();

  const form = useLoginForm();
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const loginFields: Field<LoginFormValues>[] = [
    {
      name: "email",
      label: "Email",
      type: "text",
      placeholder: "Masukkan emailmu",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Masukkan passwordmu",
    },
  ];

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const res = await login({ email: data.email, password: data.password });
      if (res?.status === 200) {
        afterSuccessLogin(res.data.accessToken, res.data.refreshToken);

        setTimeout(() => {}, 100);

        showToast("Login Sukses", "SUCCESS");
      }
    } catch (error : any) {
      showToast(error.message, "ERROR");
    }
  };

  return {
    form: {
      ...form,
      handleSubmit,
    },
    onSubmit,
    isLoading: isSubmitting,
    loginFields,
    isValid,
  };
}
