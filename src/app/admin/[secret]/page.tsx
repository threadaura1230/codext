import { redirect } from "next/navigation";

export default async function AdminPage({ params }: { params: Promise<{ secret: string }> }) {
  const { secret } = await params;
  redirect(`/admin/${secret}/dashboard`);
}
