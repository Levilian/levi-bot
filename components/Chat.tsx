import { useEffect, useState } from 'react'
import { Button } from './Button'
import { ChatLine, LoadingChatLine, ChatMessage } from './ChatLine'
import { useCookies } from 'react-cookie'
// import { toast } from 'react-hot-toast'

const COOKIE_NAME = 'levi-chat-bot'

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatMessage[] = [
  { role:'system',
    content: "You are levi. Reply using Carl Rogers\' person-centered therapy method when appropriate. Don't say offensive or harmful things. Don't mention that you're an AI."
  },
  {
    role: 'assistant',
    content: "Hey, how's it going?",
  },
]

const InputMessage = ({ input, setInput, sendMessage }: any) => (
  <div className="clear-both mt-6 flex">
    <input
      type="text"
      aria-label="chat input"
      required
      className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm"
      placeholder="Type your message..."
      value={input}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          sendMessage(input)
          setInput('')
        }
      }}
      onChange={(e) => {
        setInput(e.target.value)
      }}
    />
    <Button
      type="submit"
      className="flex-none ml-4"
      onClick={() => {
        sendMessage(input)
        setInput('')
      }}
    >
      Send
    </Button>
  </div>
)

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [cookie, setCookie] = useCookies([COOKIE_NAME])

  useEffect(() => {
    if (!cookie[COOKIE_NAME]) {
      // generate a semi random short id
      const randomId = Math.random().toString(36).substring(7)
      setCookie(COOKIE_NAME, randomId)
    }
  }, [cookie, setCookie])

  const sendMessage = async (content: string) => {
    setLoading(true)
    const newMessages = [
      ...messages,
      { role: 'user', content: content } as ChatMessage,
    ]

    setMessages(newMessages)
    
    // let payload: OpenAIPayload = {
    //   model: process.env.AI_MODEL || 'gpt-3.5-turbo',
    //   messages: messages,
    //   temperature: 0.8,
    //   max_tokens: 1024,
    //   stream: true,
    //   user: cookie[COOKIE_NAME],
    // }

    // const completion = await openai.chat.completions.create(payload);

    // let lastMessage = ''
    // for await (const chunk of completion) {
    //   lastMessage = lastMessage + chunk.choices[0]?.delta?.content || ''
      
    //   setMessages([
    //     ...newMessages,
    //     { role: 'assistant', content: lastMessage } as ChatMessage,
    //   ])
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        messages: newMessages,
        user: cookie[COOKIE_NAME],
      }),
    })
    console.log('Edge function returned.')

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // This data is a ReadableStream
    const data = response.body
    if (!data) {
      return
    }
    const reader = data.getReader()    
    const decoder = new TextDecoder('utf-8')
    let done = false
    let lastMessage = ''

    while (!done) {
      const { value, done: doneReading } = await reader.read()

      done = doneReading
      const chunkValue = decoder.decode(value)
      lastMessage = lastMessage + chunkValue

      setLoading(false)
      setMessages([
        ...newMessages,
        { role: 'assistant', content: lastMessage } as ChatMessage,
      ])
    }
  }

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-auto rounded-2xl border-zinc-200 lg:border lg:p-6">
      <div className="h-full overflow-auto px-4">
        {/* <ChatLine key={0} role={'assistant'} content={'hey how\'s it going!'} /> */}
        {messages.slice(1).map(({ content, role }, index) => (
          <ChatLine key={index} role={role} content={content} />
        ))}

        {loading && <LoadingChatLine />}
      </div>

      <InputMessage
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
      />
    </div>
  )
}
