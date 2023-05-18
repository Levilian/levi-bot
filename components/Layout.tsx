import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <header>{/* test */}</header>

      <main>{children}</main>

      <footer>{/* test */}</footer>
    </div>
  );
}