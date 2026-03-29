import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-error";
import { AIAnswersSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const { question, content, userAnswer } = await req.json();

  // console.log("We called API answers route");

  try {
    const validatedResult = AIAnswersSchema.safeParse({
      question,
      content,
      userAnswer,
    });

    console.log(validatedResult);

    if (!validatedResult.success) {
      console.log(
        "We have validation error",
        validatedResult.error.flatten().fieldErrors,
      );

      throw new ValidationError(validatedResult.error.flatten().fieldErrors);
    }

    // const { text } = await generateText({
    //   model: deepseek("deepseek-chat"),
    //   prompt: `Generate a markdown-formatted response to the following question: "${question}".

    //     Consider the provided context:
    //     **Context:** ${content}

    //     Also, prioritize and incorporate the user's answer when formulating your response:
    //     **User's Answer:** ${userAnswer}

    //     Prioritize the user's answer only if it's correct. If it's incomplete or incorrect, improve or correct it while keeping the response concise and to the point.
    //     Provide the final answer in markdown format.`,
    //   system:
    //     "You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary. For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).",
    // });

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `
        Generate a markdown-formatted response to the following question: "${question}".

        Consider the provided context:
        **Context:** ${content}

        Also, prioritize and incorporate the user's answer when formulating your response:
        **User's Answer:** ${userAnswer}

        Prioritize the user's answer only if it's correct. If it's incomplete or incorrect, improve or correct it while keeping the response concise and to the point.
        Provide the final answer in markdown format.`,
      system: `
      You are a helpful assistant that provides informative responses in markdown format. 
      Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary.
      For code blocks, use short-form smaller case language identifiers 
      (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).
      `,
    });

    return NextResponse.json({ success: true, data: text }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as ApiErrorResponse;
  }
}
