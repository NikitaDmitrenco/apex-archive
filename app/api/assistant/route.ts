import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type {
  ChatCompletionAssistantMessageParam,
  ChatCompletionMessageFunctionToolCall,
  ChatCompletionMessageToolCall,
} from "openai/resources/chat/completions";

import { executeTool } from "@/lib/ai/execute";
import { systemPrompt } from "@/lib/ai/prompt";
import type { ToolName } from "@/lib/ai/schemas";
import { tools } from "@/lib/ai/tools";

export const runtime = "nodejs";
export const maxDuration = 30;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ToolResult = {
  tool: string;
  args: unknown;
  result: unknown;
};

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const question =
    typeof body === "object" && body !== null && "question" in body
      ? (body as { question: unknown }).question
      : undefined;

  if (
    !question ||
    typeof question !== "string" ||
    question.length === 0 ||
    question.length > 500
  ) {
    return NextResponse.json({ error: "Invalid question" }, { status: 400 });
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ],
    tools,
    tool_choice: "auto",
  });

  const message = completion.choices[0].message;
  const functionCalls = (message.tool_calls ?? []).filter(
    (
      call: ChatCompletionMessageToolCall,
    ): call is ChatCompletionMessageFunctionToolCall =>
      call.type === "function",
  );

  if (functionCalls.length === 0) {
    return NextResponse.json({
      answer: message.content ?? "",
      toolResults: [] as ToolResult[],
    });
  }

  const toolResults: ToolResult[] = await Promise.all(
    functionCalls.map(async (call) => {
      const parsedArgs = JSON.parse(call.function.arguments);
      const result = await executeTool(
        call.function.name as ToolName,
        parsedArgs,
      );
      return { tool: call.function.name, args: parsedArgs, result };
    }),
  );

  // Reassemble the assistant message with only the function calls we actually answered —
  // any custom tool calls we filtered out would otherwise hang the second turn waiting
  // for a matching tool response that we never send.
  const assistantMessage: ChatCompletionAssistantMessageParam = {
    role: "assistant",
    content: message.content ?? "",
    tool_calls: functionCalls,
  };

  const followup = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
      assistantMessage,
      ...functionCalls.map((call, index) => ({
        role: "tool" as const,
        tool_call_id: call.id,
        content: JSON.stringify(toolResults[index].result),
      })),
    ],
  });

  return NextResponse.json({
    answer: followup.choices[0].message.content ?? "",
    toolResults,
  });
}
