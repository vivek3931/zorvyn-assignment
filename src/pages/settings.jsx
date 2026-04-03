import { useRole } from "@/contexts/role-provider";
import { useDataStore } from "@/contexts/data-store";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Download, ShieldAlert, User, Moon, Sun, CheckCircle2, Database,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

function SettingSection({
  title,
  description,
  children,
}) {
  return (
    <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>}
      </div>
      <div className="rounded-xl border bg-card divide-y divide-border overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}

function SettingRow({ children }) {
  return <div className="flex items-center justify-between gap-4 px-5 py-4">{children}</div>;
}

export default function Settings() {
  const { role, setRole } = useRole();
  const { theme, setTheme } = useTheme();
  const { transactions } = useDataStore();
  const [exported, setExported] = useState(false);

  const handleExportCSV = () => {
    const headers = ["ID", "Date", "Title", "Category", "Type", "Amount", "Note"];
    const csvContent = [
      headers.join(","),
      ...transactions.map(tx => [
        tx.id, tx.date,
        `"${tx.title.replace(/"/g, '""')}"`,
        `"${tx.category}"`,
        tx.type, tx.amount,
        `"${(tx.note || "").replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `transactions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const roles = [
    {
      id: "viewer",
      label: "Viewer",
      description: "Read-only. Can browse data, charts, and insights.",
      icon: User,
    },
    {
      id: "admin",
      label: "Admin",
      description: "Full control. Can add, edit, delete, and export data.",
      icon: ShieldAlert,
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <motion.div
      className="max-w-6xl space-y-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your preferences and account access.</p>
      </motion.div>

      <div className="space-y-8">
        {/* Divider line */}
        <motion.div variants={itemVariants} className="border-t" />

        {/* Role Access */}
        <SettingSection
          title="Role Access"
          description="Controls what you can see and do across the dashboard. Switching roles takes effect immediately."
        >
          {roles.map((r) => {
            const isActive = role === r.id;
            return (
              <motion.div
                key={r.id}
                onClick={() => setRole(r.id)}
                whileHover={{ backgroundColor: "hsl(var(--muted)/0.5)" }}
                transition={{ duration: 0.12 }}
                className={`flex items-center justify-between gap-4 px-5 py-4 cursor-pointer transition-colors relative ${
                  isActive ? "bg-accent/5" : ""
                }`}
              >
                {/* Active left bar */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent rounded-r"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      exit={{ scaleY: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-3.5">
                  <div className={`p-2 rounded-lg ${isActive ? "bg-accent/15" : "bg-muted"}`}>
                    <r.icon className={`h-4 w-4 ${isActive ? (r.iconColor ?? "text-accent") : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                      {r.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
                  </div>
                </div>

                <AnimatePresence>
                  {isActive ? (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 420, damping: 22 }}
                    >
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-4 w-4 rounded-full border-2 border-border shrink-0"
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </SettingSection>

        <motion.div variants={itemVariants} className="border-t" />

        {/* Appearance */}
        <SettingSection
          title="Appearance"
          description="Choose your preferred theme. Your selection is saved automatically."
        >
          <SettingRow>
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-lg bg-muted">
                <AnimatePresence mode="wait">
                  {theme === "dark" ? (
                    <motion.div key="moon" initial={{ rotate: -30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 30, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  ) : (
                    <motion.div key="sun" initial={{ rotate: 30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -30, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {theme === "dark" ? "Using dark theme" : "Using light theme"}
                </p>
              </div>
            </div>
            <motion.div whileTap={{ scale: 0.88 }}>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(c) => setTheme(c ? "dark" : "light")}
              />
            </motion.div>
          </SettingRow>
        </SettingSection>

        {/* Data Management — admin only */}
        {role === "admin" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-t mb-8" />
            <SettingSection
              title="Data Management"
              description="Export your transaction history as a CSV file for use in Excel, Google Sheets, or any other tool."
            >
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-2 rounded-lg bg-muted">
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Export transactions</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {transactions.length} records · CSV format
                    </p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    onClick={handleExportCSV}
                    variant="outline"
                    size="sm"
                    className="gap-2 min-w-[116px] relative overflow-hidden text-xs font-medium"
                  >
                    <AnimatePresence mode="wait">
                      {exported ? (
                        <motion.span
                          key="done"
                          className="flex items-center gap-1.5"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          Exported!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          className="flex items-center gap-1.5"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                        >
                          <Download className="h-3.5 w-3.5" />
                          Export CSV
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </div>
            </SettingSection>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
