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
    // TODO
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
              <FormItem className="flex flex-col w-full gap-2.5">
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
                    className="px-4 py-6 min-h-12 border paragraph-regular light-border-2 text-dark300_light700 no-focus background-light900_dark300 rounded-1.5"
                  />
                </FormControl>
              </FormItem>
            )}
          ></FormField>
        ))}

        {formType === "SIGN_IN" && (
          <Link href={"/forget"} className="inline-block body-medium">
            Forget Password ?
          </Link>
        )}

        <Button
          disabled={form.formState.isSubmitting}
          className="primary-gradient w-full min-h-12 px-4 py-3 paragraph-medium !text-light-900 font-inter rounded-2"
        >
          {buttonText}
        </Button>

        {formType === "SIGN_IN" ? (
          <p className="text-center text-dark400_light700 font-inter">
            Don't have an account?{" "}
            <Link
              href={ROUTES.SIGN_UP}
              className="font-semibold paragraph-semibold font-inter primary-text-gradient "
            >
              Sign Up
            </Link>{" "}
          </p>
        ) : (
          <p className="text-center text-dark400_light700 font-inter">
            Already have an account?{" "}
            <Link
              href={ROUTES.SIGN_IN}
              className="font-semibold paragraph-semibold font-inter primary-text-gradient "
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
