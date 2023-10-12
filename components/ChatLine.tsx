import clsx from 'clsx'

type Agent = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  role: Agent
  content: string
}

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <div className="flex min-w-full animate-pulse px-4 py-4 sm:px-6">
    <div className="flex flex-grow space-x-3">
      <div className="min-w-0 flex-1">
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 h-2 rounded bg-zinc-500"></div>
            <div className="col-span-1 h-2 rounded bg-zinc-500"></div>
          </div>
          <div className="h-2 rounded bg-zinc-500"></div>
        </div>
      </div>
    </div>
  </div>
)

// util helper to convert new lines to <br />
const convertNewLines = (text: string) =>
  text.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ))

export function ChatLine({ role = 'assistant', content }: ChatMessage) {
  if (!content) {
    return null
  }
  const formattedMessage = convertNewLines(content)

  return (
    <div
      className={
        role != 'assistant' ? 'float-right clear-both' : 'float-left clear-both'
      }
    >
        <div className={"float-right mb-4 rounded-lg px-4 py-4 shadow-lg ring-1 ring-zinc-100 sm:px-6" + clsx(
                  'text ',
                  role == 'assistant' ? 'bg-gray-100' : 'bg-indigo-500'
                )}>
          <div className="flex space-x-3">
            <div className='flex-1 gap-4'>
              <p
                className={clsx(
                  'text ',
                  role == 'assistant' ? 'font- font-semibold' : 'text-white font-semibold'
                )}
              >
                {formattedMessage}
              </p>
            </div>
          </div>
        </div>
    </div>
  )
}
