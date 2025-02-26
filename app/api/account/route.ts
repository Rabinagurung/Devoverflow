import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ForbiddenError, NotFoundError } from "@/lib/http-error";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";

import { ApiErrorResponse } from "@/types/gloabl";
import { NextResponse } from "next/server";

export async function GET(_: Request) {
  try {
    await dbConnect();

    const accounts = await Account.find();

    return NextResponse.json(
      { success: true, data: accounts },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as ApiErrorResponse;
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  try {
    await dbConnect();

    const validatedData = AccountSchema.parse(body);

    const existingAccount = await User.findOne({
      provider: validatedData.provider,
      providerAccountId: validatedData.providerAccountId,
    });

    if (existingAccount) {
      return new ForbiddenError(
        "An account with same provider already exists."
      );
    }

    const newAccount = await Account.create(validatedData);

    return NextResponse.json(
      { success: true, data: newAccount },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "api") as ApiErrorResponse;
  }
}
