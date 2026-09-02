import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const features = [
  {
    title: "Peso",
    description: "Registra tu peso corporal y visualiza tu progreso a lo largo del tiempo.",
  },
  {
    title: "IMC",
    description: "Calculamos tu Índice de Masa Corporal automáticamente en cada registro.",
  },
  {
    title: "Grasa corporal",
    description: "Lleva el control de tu porcentaje de grasa corporal cuando lo midas.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-lg font-semibold tracking-tight text-zinc-900">CuerPower</span>
        <nav className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
            Iniciar sesión
          </Link>
          <Link href="/register">
            <Button>Crear cuenta</Button>
          </Link>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-6 py-20 text-center">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Seguimiento de peso, IMC y grasa corporal en un solo lugar
        </h1>
        <p className="mt-5 max-w-xl text-lg text-zinc-600">
          Registra tus mediciones, calcula tu IMC automáticamente y observa tu progreso a lo largo
          del tiempo.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link href="/register">
            <Button>Comenzar gratis</Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost">Ya tengo cuenta</Button>
          </Link>
        </div>

        <div className="mt-24 grid w-full gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="text-left">
              <h2 className="text-base font-semibold text-zinc-900">{feature.title}</h2>
              <p className="mt-2 text-sm text-zinc-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
