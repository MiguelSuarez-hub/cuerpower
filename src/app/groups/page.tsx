import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { CreateGroupForm } from "@/components/groups/CreateGroupForm";
import { JoinGroupForm } from "@/components/groups/JoinGroupForm";

export default async function GroupsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const memberships = await prisma.groupMember.findMany({
    where: { userId: session.user.id },
    include: { group: { include: { _count: { select: { members: true } } } } },
    orderBy: { joinedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Grupos</h1>
        <p className="mt-1 text-sm text-zinc-600">Compite con otros usuarios cada mes.</p>
      </div>

      <Card>
        <h2 className="text-base font-semibold text-zinc-900">Tus grupos</h2>
        {memberships.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">Aún no perteneces a ningún grupo.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {memberships.map(({ group }) => (
              <li key={group.id}>
                <Link
                  href={`/groups/${group.id}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 px-4 py-3 text-sm hover:border-zinc-200 hover:bg-zinc-50"
                >
                  <span className="font-medium text-zinc-900">{group.name}</span>
                  <span className="text-zinc-500">
                    {group._count.members} miembro{group._count.members === 1 ? "" : "s"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <h2 className="text-base font-semibold text-zinc-900">Crear grupo</h2>
          <div className="mt-4">
            <CreateGroupForm />
          </div>
        </Card>
        <Card>
          <h2 className="text-base font-semibold text-zinc-900">Unirme con un código</h2>
          <div className="mt-4">
            <JoinGroupForm />
          </div>
        </Card>
      </div>
    </div>
  );
}
