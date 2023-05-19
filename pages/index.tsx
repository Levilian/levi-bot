import { Text, Page } from '@vercel/examples-ui'
import { Chat } from '../components/Chat'

function Home() {
  return (
    <div className='w-full max-w-4xl p-8 mx-auto lg:p-16'>
      <section className='flex flex-col gap-3'>
        <Text variant="h1" >Levi talking style chatbot</Text>
        <hr className='w-full h-1 mt-2 mb-4 border-0 border-t border-gray-400' />
        <h1 className='block pl-1 text-sm tracking-tight text-gray-700'>
           Disclaimer: Although the Levi chatbot is fine-tuned on Levi's real chat history, it doesn't know anything about Levi nor real people in his life.
           There's zero factual basis for the things it says. It could also produce harmful content given it's trained on a base language model. 
        </h1>
        <Chat />
      </section>
    </div>

  //   <div className="mx-auto flex h-full w-full max-w-5xl flex-col gap-3 py-16">
  //   <section className="flex h-full w-full flex-col gap-3">
  //       <Chat />
  //   </section>
  // </div>
  )
}

export default Home
