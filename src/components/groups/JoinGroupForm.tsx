"use client";

import { useActionState } from "react";
import { joinGroupAction } from "@/app/actions/groups";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function JoinGroupForm() {
  const [state, action, pending] = useActionState(joinGroupAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Input
        id="invite-code"
        name="inviteCode"
        label="Código de invitación"
        placeholder="ABCD2345"
        required
      />
      {state?.error && <p className="text-sm text-rose-600">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Uniéndote..." : "Unirme"}
      </Button>
    </form>
  );
}
