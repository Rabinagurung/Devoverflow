import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-error";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { ApiErrorResponse } from "@/types/gloabl";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();
  try {
    const validatedData = UserSchema.partial().safeParse({ email });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const user = await User.findOne({ email });

    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ sucess: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as ApiErrorResponse;
  }
}
