import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";

export function AppHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
          CuerPower
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
            Panel
          </Link>
          <Link href="/groups" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
            Grupos
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Cerrar sesión
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
