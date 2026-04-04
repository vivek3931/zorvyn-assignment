import { useDataStore } from "@/contexts/data-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

const PIE_COLORS = ["#1e3a5f", "#0d9488", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6", "#10b981", "#f97316", "#3b82f6", "#ec4899"];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const chartVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function StatCard({ title, value, icon, valueClass }) {
  return (
    <motion.div variants={cardVariants}>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <motion.div whileHover={{ scale: 1.15, rotate: 8 }} transition={{ type: "spring", stiffness: 300 }}>
            {icon}
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div
            className={`text-2xl font-bold tracking-tight ${valueClass ?? ""}`}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {value}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Dashboard() {
  const { summary, monthlyTrend, categoryBreakdown } = useDataStore();

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={cardVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here is your financial summary.</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(summary.totalBalance)}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Total Income"
          value={formatCurrency(summary.totalIncome)}
          valueClass="text-emerald-600"
          icon={<ArrowUpRight className="h-4 w-4 text-emerald-500" />}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary.totalExpenses)}
          valueClass="text-destructive"
          icon={<ArrowDownRight className="h-4 w-4 text-destructive" />}
        />
        <StatCard
          title="Transactions"
          value={String(summary.transactionCount)}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <motion.div className="col-span-1 md:col-span-2 lg:col-span-4" variants={chartVariants}>
          <Card className="hover:shadow-md transition-shadow duration-200 h-full">
            <CardHeader>
              <CardTitle className="text-base">Cash Flow Trend</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      formatter={(val) => formatCurrency(val)}
                    />
                    <Area type="monotone" dataKey="income" name="Income" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#gIncome)" dot={false} activeDot={{ r: 4 }} />
                    <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#gExpense)" dot={false} activeDot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="col-span-1 md:col-span-2 lg:col-span-3" variants={chartVariants}>
          <Card className="hover:shadow-md transition-shadow duration-200 h-full">
            <CardHeader>
              <CardTitle className="text-base">Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {categoryBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="44%"
                        innerRadius={58}
                        outerRadius={82}
                        paddingAngle={3}
                        dataKey="amount"
                        nameKey="category"
                        animationBegin={200}
                        animationDuration={700}
                      >
                        {categoryBreakdown.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(val, _name, props) => [formatCurrency(val), props?.payload?.category]}
                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No data</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={chartVariants}>
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="pt-5 pb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categoryBreakdown.slice(0, 4).map((cat, i) => (
                <motion.div
                  key={cat.category}
                  className="space-y-1"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.07, duration: 0.4 }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium truncate text-muted-foreground">{cat.category}</span>
                    <span className="font-semibold text-foreground ml-2">{cat.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ delay: 0.55 + i * 0.07, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <div className="text-xs font-medium text-foreground">{formatCurrency(cat.amount)}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
