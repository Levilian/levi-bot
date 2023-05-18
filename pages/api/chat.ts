import { type OpenAIStreamPayload, OpenAIStream } from '../../utils/OpenAIStream'

// break the app if the API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing Environment Variable OPENAI_API_KEY')
}

export const config = {
  runtime: 'edge',
}

const handler = async (req: Request): Promise<Response> => {
  const body = await req.json()

  const payload: OpenAIStreamPayload = {
    model: process.env.AI_MODEL || 'gpt-3.5-turbo',
    prompt: body?.prompt || '',
    temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
    max_tokens: process.env.AI_MAX_TOKENS
      ? parseInt(process.env.AI_MAX_TOKENS)
      : 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    stop: ['\n###'],
    user: body?.user,
  }

  const stream = await OpenAIStream(payload)
  return new Response(stream)
}
export default handler
