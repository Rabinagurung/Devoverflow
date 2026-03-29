import { NextResponse } from "next/server";

import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { ForbiddenError, ValidationError } from "@/lib/http-error";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";

export async function GET() {
  try {
    await dbConnect();

    const accounts = await Account.find();

    console.log("here we are");
    return NextResponse.json(
      { success: true, data: accounts },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as ApiErrorResponse;
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  try {
    await dbConnect();

    const validatedData = AccountSchema.safeParse(body);
    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const existingAccount = await Account.findOne({
      provider: validatedData.data.provider,
      providerAccountId: validatedData.data.providerAccountId,
    });

    if (existingAccount) {
      throw new ForbiddenError("An account with same provider already exists.");
    }

    const newAccount = await Account.create(validatedData);

    return NextResponse.json(
      { success: true, data: newAccount },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as ApiErrorResponse;
  }
}
