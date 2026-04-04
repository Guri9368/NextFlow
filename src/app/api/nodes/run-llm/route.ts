import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  model: z.string().default("gemini-1.5-flash"),
  systemPrompt: z.string().optional().default(""),
  userMessage: z.string().min(1, "User message is required"),
  images: z.array(z.string()).optional().default([]),
})

async function tryGemini(apiKey: string, modelName: string, requestBody: any) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  })
  const data = await res.json()
  return { ok: res.ok, data, status: res.status }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      )
    }

    const { systemPrompt, userMessage, images } = parsed.data

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured. Add it to your .env file." },
        { status: 500 }
      )
    }

    // Build user content parts
    const userParts: any[] = [{ text: userMessage }]

    for (const imgUrl of images) {
      if (imgUrl.startsWith("data:")) {
        const [header, base64] = imgUrl.split(",")
        const mimeType = header.replace("data:", "").replace(";base64", "")
        userParts.push({ inlineData: { mimeType, data: base64 } })
      }
    }

    // System prompt as conversation prefix (works on all versions)
    const messages: any[] = []
    if (systemPrompt) {
      messages.push({ role: "user", parts: [{ text: `Instructions: ${systemPrompt}` }] })
      messages.push({ role: "model", parts: [{ text: "Understood, I will follow these instructions." }] })
    }
    messages.push({ role: "user", parts: userParts })

    const requestBody = {
      contents: messages,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    }

    // First: auto-discover available models from the API
    let availableModels: string[] = []
    try {
      const listRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      )
      const listData = await listRes.json()
      if (listRes.ok && listData.models) {
        availableModels = listData.models
          .filter((m: any) =>
            m.name &&
            m.supportedGenerationMethods?.includes("generateContent") &&
            m.name.includes("gemini")
          )
          .map((m: any) => m.name.replace("models/", ""))
          // prefer flash models first (faster + cheaper)
          .sort((a: string, b: string) => {
            if (a.includes("flash") && !b.includes("flash")) return -1
            if (!a.includes("flash") && b.includes("flash")) return 1
            return 0
          })
      }
    } catch (_) {}

    // Fallback list if discovery fails
    const fallbackModels = [
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash-8b",
      "gemini-1.5-pro",
      "gemini-pro",
      "gemini-1.0-pro",
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
    ]

    const modelsToTry = availableModels.length > 0 ? availableModels : fallbackModels

    let lastError = ""
    for (const modelName of modelsToTry) {
      const { ok, data } = await tryGemini(apiKey, modelName, requestBody)

      if (ok) {
        const response =
          data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated"
        return NextResponse.json({ response, model: modelName })
      }

      const errMsg = data?.error?.message || `HTTP error`
      lastError = errMsg

      // Only skip to next model if it's a model availability issue
      const isModelError =
        errMsg.includes("not found") ||
        errMsg.includes("not supported") ||
        errMsg.includes("deprecated") ||
        errMsg.includes("does not exist")

      if (!isModelError) break
    }

    return NextResponse.json(
      { error: `All models failed. Last error: ${lastError}` },
      { status: 500 }
    )
  } catch (err: any) {
    console.error("LLM route error:", err)
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}