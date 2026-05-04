import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "⬛" },
    { href: "/admin/pacientes", label: "Pacientes", icon: "👤" },
    { href: "/admin/psicologos", label: "Psicólogos", icon: "🩺" },
    { href: "/admin/matchings", label: "Matchings", icon: "🔗" },
    { href: "/admin/sesiones", label: "Sesiones", icon: "📅" },
    { href: "/admin/metricas", label: "Métricas", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f4] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#1c2b1c] flex flex-col shrink-0">
        <div className="p-5 border-b border-[#2f522f]">
          <span
            className="text-lg font-semibold text-[#c7d9c7]"
            style={{ fontFamily: "Lora, Georgia, serif" }}
          >
            PSYConnect
          </span>
          <div className="text-xs text-[#6e9f6e] mt-0.5">Panel interno</div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#9dbf9d] hover:bg-[#2f522f] hover:text-[#c7d9c7] transition-colors"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#2f522f]">
          <div className="text-xs text-[#4d824d] mb-3 truncate">
            {session.user?.email}
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="w-full text-xs text-[#6e9f6e] hover:text-[#9dbf9d] transition-colors text-left"
            >
              Cerrar sesión →
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
