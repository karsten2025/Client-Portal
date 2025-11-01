// app/page.tsx
import { redirect } from "next/navigation";

export default function Index() {
  // Direkt auf die Kachel-Phase springen
  redirect("/explore");
  return null;
}
