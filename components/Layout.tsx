import { ReactNode } from "react";
import Head from 'next/head';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Head>
        <title>
          Levi Bot: Mimicking Levi&apos;s Talking Style
        </title>
        <meta
          name="description"
          content="Check out Levi Bot, a chatbot trained on Levi&apos;s real chat history."
          key="desc"
        />
        <meta property="og:title" content="Levi Bot: Mimicking Levi's Talking Style" />
        <meta
          property="og:description"
          content="ChatGPT trained on Levi&apos;s real chat history."
        />
        <meta
          property="og:image"
          content="https://i.ibb.co/x8jRrvy/Levi-high-resolution-color-logo.png"
        />
      </Head>

      <main>{children}</main>

      <footer>{/* test */}</footer>
    </div>
  );
}