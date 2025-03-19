"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z, ZodType } from "zod";

import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  formType: "SIGN_IN" | "SIGN_UP";
  onSubmit: (data: T) => Promise<ActionResponse>;
}

const buttonTextMap = {
  SIGN_IN: { default: "Sign In", loading: "Signing In..." },
  SIGN_UP: { default: "Sign Up", loading: "Signing Up..." },
};

const AuthForm = <T extends FieldValues>({
  schema,
  formType,
  defaultValues,
  onSubmit,
}: AuthFormProps<T>) => {
  const router = useRouter();
  // Initialize RHF and prepare to track fields dynamically
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const buttonText = form.formState.isSubmitting
    ? buttonTextMap[formType].loading
    : buttonTextMap[formType].default;

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = (await onSubmit(data)) as ActionResponse;

    if (result?.success) {
      toast({
        title: "Success",
        description:
          formType === "SIGN_IN"
            ? "Signed in successfully"
            : "Signed up successfully",
      });
      router.push(ROUTES.HOME);
    } else {
      toast({
        title: `Error ${result?.status}`,
        description: result?.error?.message,
        variant: "destructive",
      });
    }
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
                <FormMessage />
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
            Do not have an account ?{" "}
            <Link
              href={ROUTES.SIGN_UP}
              className="paragraph-semibold primary-text-gradient font-inter font-semibold "
            >
              Sign Up
            </Link>
          </p>
        ) : (
          <p className="text-dark400_light700 text-center font-inter">
            Already have an account ?{" "}
            <Link
              href={ROUTES.SIGN_IN}
              className="paragraph-semibold primary-text-gradient font-inter font-semibold "
            >
              Sign In
            </Link>
          </p>
        )}
      </form>
    </Form>
  );
};

export default AuthForm;

/* 1. 
type T = {
  username: string;
  email: string;
  age: number;
};

Create a Zod schema for the User type

const userSchema: ZodType<T> = z.object({
  username: z.string(),
  email: z.string().email(),
  age: z.number().min(18),
});
Here:

ZodType<T> ensures that userSchema is a valid schema for the User type.
userSchema will validate objects that match the User structure (username, email, age).

Here in our case, ZodType<T> ensures is a valid schema for type T. 
signUpSchema and signInSchema will validate objects that match the strucutre of type T. 
*/

/* 2. 
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

/* 3. 
In React Hook Form, several type utilities are provided to manage form types and ensure type safety. 
These utilities are useful when working with TypeScript to type form data, default values, and validation rules.
Here's a list of the most important ones:

1. FieldValues
Represents a generic shape of form values.
It’s the base type for form data.

import { FieldValues } from "react-hook-form";

type MyFormValues = FieldValues;  // Equivalent to Record<string, any>


2. DefaultValues<T>
Ensures that your defaultValues match the shape and type of the form data (T).

import { DefaultValues, useForm } from "react-hook-form";

type SignUpForm = {
  username: string;
  email: string;
  password: string;
};

const defaultValues: DefaultValues<SignUpForm> = {
  username: "",
  email: "",
  password: "",
};

const form = useForm<SignUpForm>({
  defaultValues,
});


3. FieldPath<T>
Returns a union of all valid keys from a form data type (T).
Useful for ensuring that dynamic field names are type-safe.

import { FieldPath } from "react-hook-form";

type SignUpForm = {
  username: string;
  email: string;
  password: string;
};

type UsernamePath = FieldPath<SignUpForm>;  // "username" | "email" | "password"

const field: UsernamePath = "username";  // ✅ Valid
const field2: UsernamePath = "age";     // ❌ Error: "age" is not a valid field

4. FieldPathValue<T, P>
Retrieves the type of a specific field (P) in the form data type (T).

import { FieldPathValue } from "react-hook-form";

type SignUpForm = {
  username: string;
  email: string;
  password: string;
};

type EmailType = FieldPathValue<SignUpForm, "email">;  

5. FieldArrayPath<T>
Returns a union of keys that represent array fields in your form data.

import { FieldArrayPath } from "react-hook-form";

type FormWithArrays = {
  users: { name: string; age: number }[];
  tags: string[];
};

type ArrayPath = FieldArrayPath<FormWithArrays>;  // "users" | "tags"


6. FieldArrayPathValue<T, P>
Returns the type of elements in an array field for the specified path.

import { FieldArrayPathValue } from "react-hook-form";

type FormWithArrays = {
  users: { name: string; age: number }[];
  tags: string[];
};

type UserType = FieldArrayPathValue<FormWithArrays, "users">;  // { name: string; age: number }

7. UseFormReturn<T>
Represents the return type of useForm when called with a specific form data type (T).
This type contains all the methods and properties returned by useForm.

import { UseFormReturn, useForm } from "react-hook-form";

type SignUpForm = {
  username: string;
  email: string;
  password: string;
};

const form: UseFormReturn<SignUpForm> = useForm<SignUpForm>();

8. UseFieldArrayReturn<T>
Represents the return type of useFieldArray, helping manage array fields in your form.

import { UseFieldArrayReturn } from "react-hook-form";

type FormWithArrays = {
  users: { name: string; age: number }[];
};

const fieldArray: UseFieldArrayReturn<FormWithArrays, "users"> = useFieldArray({
  name: "users",
});

9. Path<T> (Alias for FieldPath<T>)
Returns a type-safe string representing a valid path in T. Commonly used for form fields.

import { Path } from "react-hook-form";

type SignUpForm = {
  username: string;
  profile: {
    age: number;
  };
};

type ProfilePath = Path<SignUpForm>;  // "username" | "profile" | "profile.age"

10. DeepPartial<T>
Represents a partial version of a form data type, where all fields are optional (including nested fields).

import { DeepPartial } from "react-hook-form";

type SignUpForm = {
  username: string;
  profile: {
    age: number;
    bio: string;
  };
};

const partialForm: DeepPartial<SignUpForm> = {
  username: "Ram",
  profile: {
    age: 25,
  },
};

Summary of Key Utilities: 


Utility	Description: 


FieldValues	Represents the base shape for form values (Record<string, any>)
DefaultValues<T>	Ensures defaultValues match the form data type T
FieldPath<T>	Type-safe union of keys from T
FieldPathValue<T, P>	Returns the type of a specific field in T
FieldArrayPath<T>	Union of keys that are arrays in T
FieldArrayPathValue<T, P>	Type of elements in an array field
UseFormReturn<T>	Represents the return type of useForm
DeepPartial<T>	Makes all fields in T optional (including nested fields)

Why Use These Utilities?
Type-Safe Forms: Avoid runtime errors by ensuring your form fields and data structures match.
Better Developer Experience: Autocomplete and type-checking help prevent mistakes.
Dynamic Field Handling: Utilities like FieldPath make working with dynamic fields easier.

 */
