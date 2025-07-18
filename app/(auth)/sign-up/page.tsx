import React from "react";

import AuthForm from "@/components/forms/AuthForm";
import { signUpWithCredentials } from "@/lib/actions/auth.action";
import { SignUpSchema } from "@/lib/validations";

const SignUp = () => {
  return (
    <div>
      <h1>Sign Up Form</h1>
      <AuthForm
        formType="SIGN_UP"
        schema={SignUpSchema}
        defaultValues={{ username: "", name: "", email: "", password: "" }}
        onSubmit={signUpWithCredentials}
      />
    </div>
  );
};

export default SignUp;
