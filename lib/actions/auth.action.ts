"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { signIn } from "@/auth";
import Account from "@/database/account.model";
import User from "@/database/user.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { SignInSchema, SignUpSchema } from "../validations";

export async function signUpWithCredentials(
  params: AuthCredentials,
): Promise<ActionResponse> {
  const validatedResult = await action({ params, schema: SignUpSchema });

  if (validatedResult instanceof Error)
    return handleError(validatedResult) as ErrorResponse;

  const { name, username, email, password } = validatedResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);

    if (existingUser) throw new Error("User already exists.");

    const existingUsername = await User.findOne({ username }).session(session);

    if (existingUsername) throw new Error("Username already exists.");

    const hassedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await User.create([{ name, username, email }], {
      session,
    });

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          password: hassedPassword,
          provider: "credentials",
          providerAccountId: email,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">,
): Promise<ActionResponse> {
  const validatedResult = await action({ params, schema: SignInSchema });

  if (validatedResult instanceof Error)
    return handleError(validatedResult) as ErrorResponse;

  const { email, password } = validatedResult.params!;

  try {
    // const existingUser = await User.findOne({ email });

    // if (!existingUser) throw new NotFoundError("User");

    // const existingAccount = await Account.findOne({
    //   provider: "credentials",
    //   providerAccountId: email,
    // });

    // if (!existingAccount) throw new NotFoundError("Account");

    // const isMatchingPassword = await bcrypt.compare(
    //   password,
    //   existingAccount.password,
    // );

    // if (!isMatchingPassword) throw new Error("Password does not match");

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
