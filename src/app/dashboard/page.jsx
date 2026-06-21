"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    const role = session?.user?.role;

    if (role === "founder") {
      router.push("/dashboard/founder");
    } else if (role === "collaborator") {
      router.push("/dashboard/collaborator");
    } else {
      router.push("/");
    }
  }, [session, isPending, router]);

  return <div>Loading...</div>;
}