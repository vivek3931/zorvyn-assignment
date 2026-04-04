import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Settings,
  TrendingUp,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRole } from "@/contexts/role-provider";
import { useDataStore } from "@/contexts/data-store";
import { motion } from "framer-motion";

const navItems = [
  { title: "Overview",     url: "/",             icon: LayoutDashboard, desc: "Summary & charts" },
  { title: "Transactions", url: "/transactions",  icon: ArrowLeftRight,  desc: "All records" },
  { title: "Insights",     url: "/insights",      icon: PieChart,        desc: "Spending analysis" },
  { title: "Settings",     url: "/settings",      icon: Settings,        desc: "Preferences" },
];

function formatCurrency(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
export function AppSidebar() {
  const [location] = useLocation();
  const { role } = useRole();
  const { summary } = useDataStore();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const total = (summary.totalIncome || 0) + (summary.totalExpenses || 0);
  const incomeRatio = total > 0 ? Math.round((summary.totalIncome / total) * 100) : 0;

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar variant="sidebar" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="px-5 h-14 flex items-center border-b border-sidebar-border shrink-0">
        <img
          src="https://companyasset.blob.core.windows.net/assets/zorvynfulllogolight.png"
          alt="Zorvyn"
          className="h-6 w-auto object-contain"
        />
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-0 px-3 pt-5 pb-3">
        <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 select-none">
          Navigation
        </p>

        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = location === item.url;
            return (
              <Link key={item.title} href={item.url} onClick={handleLinkClick}>
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer group transition-colors duration-150 ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-sidebar-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <div className={`shrink-0 ${isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"}`}>
                    <item.icon className="h-4 w-4" strokeWidth={isActive ? 2.2 : 1.8} />
                  </div>

                  <span className={`text-sm leading-none ${isActive ? "font-semibold" : "font-medium"}`}>
                    {item.title}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 mx-1">
          <p className="px-1 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 select-none">
            Quick Stats
          </p>
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-sidebar-foreground/60">Balance</span>
              <span className="text-xs font-bold text-sidebar-foreground">
                {formatCurrency(summary.totalBalance)}
              </span>
            </div>
            <div className="h-px bg-sidebar-border" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-sidebar-foreground/60">Income</span>
              <span className="text-xs font-semibold text-emerald-500">
                +{formatCurrency(summary.totalIncome)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-sidebar-foreground/60">Expenses</span>
              <span className="text-xs font-semibold text-red-400">
                −{formatCurrency(summary.totalExpenses)}
              </span>
            </div>
            <div className="space-y-1 pt-1">
              <div className="h-1 w-full rounded-full bg-sidebar-border overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${incomeRatio}%`,
                  }}
                  transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-sidebar-foreground/40">
                <span>Income ratio</span>
                <span>
                  {incomeRatio}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full border border-sidebar-primary/30 flex items-center justify-center shrink-0">
            <img src="https://media.licdn.com/dms/image/v2/D4D0BAQF6cfpCh0Eg6w/company-logo_200_200/B4DZipL2HGHwAI-/0/1755185113638?e=2147483647&v=beta&t=-uiMvnQKxYJ9bbY5OkIizOaMrqbJqWVDCLmJgXD7DtI" alt="Zorvyn" className="h-full w-full rounded-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-sidebar-foreground truncate">Zorvyn FinDash</p>
            <p className="text-[10px] text-sidebar-foreground/50 capitalize">
              {role} · v1.0
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
