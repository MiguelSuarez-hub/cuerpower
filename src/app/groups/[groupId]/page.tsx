import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { GroupLeaderboard } from "@/components/groups/GroupLeaderboard";
import { WeeklyLeaderboard } from "@/components/groups/WeeklyLeaderboard";
import { PendingActivityCard } from "@/components/groups/PendingActivityCard";
import { ResubmitActivityForm } from "@/components/groups/ResubmitActivityForm";
import { SubmitActivityForm } from "@/components/groups/SubmitActivityForm";
import { getCurrentMonthRange } from "@/lib/period";
import { rankByMetric } from "@/lib/leaderboard";
import { getPreviousWeekRange, getWeekRange, rankByActivityCount } from "@/lib/week";
import { leaveGroupAction } from "@/app/actions/groups";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.user.id } },
  });
  if (!membership) {
    redirect("/groups");
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: { members: { include: { user: true } } },
  });
  if (!group) {
    notFound();
  }

  const { start, end } = getCurrentMonthRange();
  const memberIds = group.members.map((member) => member.userId);

  const measurements = await prisma.measurement.findMany({
    where: { userId: { in: memberIds }, date: { gte: start, lte: end } },
    orderBy: { date: "asc" },
  });

  const membersWithMeasurements = group.members.map((member) => ({
    userId: member.userId,
    name: member.user.name ?? member.user.email,
    measurements: measurements.filter((measurement) => measurement.userId === member.userId),
  }));

  const weightRanking = rankByMetric(membersWithMeasurements, "weight");
  const bmiRanking = rankByMetric(membersWithMeasurements, "bmi");
  const bodyFatRanking = rankByMetric(membersWithMeasurements, "bodyFatPct");

  const monthLabel = start.toLocaleDateString("es", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const currentWeek = getWeekRange();
  const previousWeek = getPreviousWeekRange();

  const activities = await prisma.activity.findMany({
    where: { groupId, date: { gte: previousWeek.start, lte: currentWeek.end } },
    orderBy: { createdAt: "desc" },
  });

  const memberNameById = new Map(
    group.members.map((member) => [member.userId, member.user.name ?? member.user.email]),
  );

  const currentWeekApproved = activities.filter(
    (activity) =>
      activity.status === "APPROVED" &&
      activity.date.getTime() >= currentWeek.start.getTime() &&
      activity.date.getTime() <= currentWeek.end.getTime(),
  );

  const weeklyRanking = rankByActivityCount(
    group.members.map((member) => {
      const approved = currentWeekApproved.filter((activity) => activity.userId === member.userId);
      return {
        userId: member.userId,
        name: member.user.name ?? member.user.email,
        approvedCount: approved.length,
        approvedMinutes: approved.reduce((sum, activity) => sum + activity.durationMin, 0),
      };
    }),
  );

  const pendingForReview = activities.filter((activity) => activity.status === "PENDING");
  const myRejected = activities.filter(
    (activity) => activity.status === "REJECTED" && activity.userId === session.user.id,
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/groups" className="text-sm text-zinc-500 hover:text-zinc-700">
          ← Grupos
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">{group.name}</h1>
        <p className="mt-1 text-sm text-zinc-600">Competencia de {monthLabel}</p>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-zinc-500">Código de invitación</p>
            <p className="mt-1 inline-block rounded-lg bg-fuchsia-50 px-3 py-1 font-mono text-lg tracking-widest text-fuchsia-700">
              {group.inviteCode}
            </p>
          </div>
          <p className="text-sm text-zinc-500">
            {group.members.length} miembro{group.members.length === 1 ? "" : "s"}
          </p>
        </div>
      </Card>

      <div className="grid gap-6 sm:grid-cols-3">
        <GroupLeaderboard title="Peso" unit=" kg" entries={weightRanking} />
        <GroupLeaderboard title="IMC" unit="" entries={bmiRanking} />
        <GroupLeaderboard title="Grasa corporal" unit="%" entries={bodyFatRanking} />
      </div>

      <WeeklyLeaderboard entries={weeklyRanking} />

      <Card>
        <h2 className="text-base font-semibold text-zinc-900">Actividades pendientes de revisión</h2>
        {pendingForReview.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">No hay actividades pendientes.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {pendingForReview.map((activity) => (
              <PendingActivityCard
                key={activity.id}
                id={activity.id}
                authorName={memberNameById.get(activity.userId) ?? "Miembro"}
                type={activity.type}
                durationMin={activity.durationMin}
                date={activity.date.toISOString()}
                evidenceUrl={activity.evidenceUrl}
                canReview={activity.userId !== session.user.id}
              />
            ))}
          </div>
        )}
      </Card>

      {myRejected.length > 0 && (
        <Card>
          <h2 className="text-base font-semibold text-zinc-900">Tus actividades rechazadas</h2>
          <p className="mt-1 text-sm text-zinc-600">Puedes editarlas y volver a enviarlas.</p>
          <div className="mt-4 flex flex-col gap-3">
            {myRejected.map((activity) => (
              <ResubmitActivityForm
                key={activity.id}
                id={activity.id}
                type={activity.type}
                durationMin={activity.durationMin}
                evidenceUrl={activity.evidenceUrl}
              />
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="text-base font-semibold text-zinc-900">Subir actividad</h2>
        <div className="mt-4">
          <SubmitActivityForm groupId={group.id} />
        </div>
      </Card>

      <form action={leaveGroupAction}>
        <input type="hidden" name="groupId" value={group.id} />
        <button type="submit" className="text-sm font-medium text-rose-600 hover:text-rose-700">
          Salir del grupo
        </button>
      </form>
    </div>
  );
}
