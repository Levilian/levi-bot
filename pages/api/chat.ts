// import { type OpenAIStreamPayload, OpenAIStream } from '../../utils/OpenAIStream'
import 'openai/shims/web'
import OpenAI from 'openai'

import { OpenAIStream, StreamingTextResponse } from 'ai'

// break the app if the API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing Environment Variable OPENAI_API_KEY')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  runtime: 'edge',
}

const handler = async (req: Request) => {
  const body = await req.json()

  const payload = {
      model: process.env.AI_MODEL || 'gpt-3.5-turbo',
      messages: body?.messages,
      temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
      max_tokens: process.env.AI_MAX_TOKENS
      ? parseInt(process.env.AI_MAX_TOKENS)
      : 500,
      frequency_penalty: process.env.AI_FREQ_PENALTY ? parseFloat(process.env.AI_FREQ_PENALTY)
      : 1.0,
      presence_penalty: process.env.AI_PRES_PENALTY ? parseFloat(process.env.AI_PRES_PENALTY)
      : 0.3,
      stream: true,
      user: body?.user,
  }

  const response = await openai.chat.completions.create(payload).asResponse()
  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
export default handler
