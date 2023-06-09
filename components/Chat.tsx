import { useEffect, useState } from 'react'
import { Button } from './Button'
import { ChatLine, LoadingChatLine, ChatMessage } from './ChatLine'
import { useCookies } from 'react-cookie'

const COOKIE_NAME = 'levi-chat-bot'

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatMessage[] = [
  {
    role: 'levi',
    prompt: 'Hi! I\'m a chatbot trained on thousands of Levi\'s messages. \n See if you can recognize me!',
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

  // send prompt to API /api/chat endpoint
  const sendMessage = async (prompt: string) => {
    setLoading(true)
    const newMessages = [
      ...messages,
      { role: 'user', prompt: prompt } as ChatMessage,
    ]
    setMessages(newMessages)

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt + '\n\n===\n\n',
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
    const decoder = new TextDecoder()
    let done = false

    let lastMessage = ''

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)

      lastMessage = lastMessage + chunkValue
      
      setMessages([
        ...newMessages,
        { role: 'levi', prompt: lastMessage } as ChatMessage,
      ])

      setLoading(false)
    }
  }

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-auto rounded-2xl border-zinc-200 lg:border lg:p-6">
      <div className="h-full overflow-auto px-4">
        {messages.map(({ prompt, role }, index) => (
          <ChatLine key={index} role={role} prompt={prompt} />
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
