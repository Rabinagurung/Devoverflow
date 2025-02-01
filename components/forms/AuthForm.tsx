"use client";

import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import ROUTES from "@/constants/routes";

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  formType: "SIGN_IN" | "SIGN_UP";
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; data: T }>;
}

const AuthForm = <T extends FieldValues>({
  schema,
  formType,
  defaultValues,
  onSubmit,
}: AuthFormProps<T>) => {
  // Initialize RHF and prepare to track fields dynamically

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const buttonTextMap = {
    SIGN_IN: { default: "Sign In", loading: "Signing In..." },
    SIGN_UP: { default: "Sign Up", loading: "Signing Up..." },
  };

  const buttonText = form.formState.isSubmitting
    ? buttonTextMap[formType].loading
    : buttonTextMap[formType].default;

  const handleSubmit: SubmitHandler<T> = async () => {
    //  TODO
  };

  return (
    <Form {...form}>
      <form
        className="mt-10 space-y-[25px]"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-dark400_light700">
                  {field.name === "email"
                    ? "Email Address"
                    : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    type={field.name === "password" ? "password" : "text"}
                    {...field}
                    className="paragraph-regular light-border-2 text-dark300_light700 no-focus background-light900_dark300 min-h-12 rounded-1.5 border px-4 py-6"
                  />
                </FormControl>
              </FormItem>
            )}
          ></FormField>
        ))}

        {formType === "SIGN_IN" && (
          <Link href={"/forget"} className="body-medium inline-block">
            Forget Password ?
          </Link>
        )}

        <Button
          disabled={form.formState.isSubmitting}
          className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900"
        >
          {buttonText}
        </Button>

        {formType === "SIGN_IN" ? (
          <p className="text-dark400_light700 text-center font-inter">
            Do not have an account?{" "}
            <Link
              href={ROUTES.SIGN_UP}
              className="paragraph-semibold primary-text-gradient font-inter font-semibold "
            >
              Sign Up
            </Link>{" "}
          </p>
        ) : (
          <p className="text-dark400_light700 text-center font-inter">
            Already have an account?{" "}
            <Link
              href={ROUTES.SIGN_IN}
              className="paragraph-semibold primary-text-gradient font-inter font-semibold "
            >
              Sign In
            </Link>{" "}
          </p>
        )}
      </form>
    </Form>
  );
};

export default AuthForm;

/*

{field} =  {
  value: "", // Comes from defaultValues
  onChange: function, // Updates form state
  onBlur: function, // Triggers validation
  ref: inputElement, // Links to the DOM input field
  name: "username" // The field name
}

How does my FormField knows about all my fields? 
Because while intializing useForm() of React hook form, we pass the defaultValues

*/
