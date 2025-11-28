import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAllTeams } from "@/actions/admin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const teams = await getAllTeams();

  return <AdminDashboard teams={teams} />;
}
