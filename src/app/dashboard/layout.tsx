import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
            CuerPower
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
