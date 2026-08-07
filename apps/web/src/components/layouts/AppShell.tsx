import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <Sidebar />
      {children}
    </>
  );
}