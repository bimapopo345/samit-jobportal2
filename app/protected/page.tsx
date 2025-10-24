import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get user profile to check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Redirect based on role
  if (profile?.role === "lembaga") {
    redirect("/dashboard/org");
  } else if (profile?.role === "admin") {
    redirect("/dashboard/admin/overview");
  } else {
    redirect("/dashboard");
  }
}
