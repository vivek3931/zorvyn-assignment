import { useDataStore } from "@/contexts/data-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, Wallet, BarChart2, PiggyBank } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const BAR_COLORS = [
  "#1e3a5f", "#0d9488", "#6366f1", "#f59e0b",
  "#ef4444", "#8b5cf6", "#10b981", "#f97316",
];

export default function Insights() {
  const { topInsights, categoryBreakdown, monthlyTrend } = useDataStore();

  const {
    topSpendingCategory,
    topSpendingAmount,
    avgMonthlyIncome,
    avgMonthlyExpense,
    savingsRate,
    monthOverMonthChange,
  } = topInsights;

  const topCats = categoryBreakdown.slice(0, 7);

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Financial Insights</h1>
        <p className="text-muted-foreground mt-1">Spending patterns and financial observations from your data.</p>
      </motion.div>


      <div className="grid gap-4 md:grid-cols-3">
        <motion.div variants={itemVariants}>
          <Card className="bg-primary text-primary-foreground h-full hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-primary-foreground text-sm font-medium opacity-90">
                <Target className="h-4 w-4" /> Top Spending Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-3xl font-bold leading-tight"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {topSpendingCategory}
              </motion.div>
              <div className="mt-2 text-sm opacity-75">{formatCurrency(topSpendingAmount)} spent overall</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <PiggyBank className="h-4 w-4" /> Savings Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-3xl font-bold text-emerald-600"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {savingsRate}%
              </motion.div>
              <div className="mt-2 text-sm text-muted-foreground">Of average monthly income</div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(savingsRate, 100)}%` }}
                  transition={{ delay: 0.55, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                {monthOverMonthChange > 0
                  ? <TrendingUp className="h-4 w-4 text-destructive" />
                  : <TrendingDown className="h-4 w-4 text-emerald-500" />
                }
                Month-over-Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className={`text-3xl font-bold ${monthOverMonthChange > 0 ? "text-destructive" : "text-emerald-600"}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {monthOverMonthChange > 0 ? "+" : ""}{monthOverMonthChange}%
              </motion.div>
              <div className="mt-2 text-sm text-muted-foreground">
                {monthOverMonthChange > 0 ? "Higher" : "Lower"} expenses vs last month
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>


      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart2 className="h-4 w-4 text-muted-foreground" /> Expense Breakdown by Category
            </CardTitle>
            <CardDescription>Total spending per category across all time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCats} margin={{ top: 8, right: 16, left: 0, bottom: 0 }} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="category" fontSize={11} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <RechartsTooltip
                    formatter={(val) => [formatCurrency(val), "Total Spent"]}
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]} animationBegin={300} animationDuration={600}>
                    {topCats.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>


      <div className="grid gap-4 md:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="h-full hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-base">Monthly Averages</CardTitle>
              <CardDescription>Average income and expense per month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-2">
              <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30">
                <div>
                  <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Avg Monthly Income</div>
                  <motion.div
                    className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {formatCurrency(avgMonthlyIncome)}
                  </motion.div>
                </div>
                <div className="p-3 bg-emerald-500/15 rounded-full">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
                <div>
                  <div className="text-xs font-medium text-red-700 dark:text-red-400">Avg Monthly Expense</div>
                  <motion.div
                    className="text-2xl font-bold text-red-700 dark:text-red-400 mt-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                  >
                    {formatCurrency(avgMonthlyExpense)}
                  </motion.div>
                </div>
                <div className="p-3 bg-red-500/15 rounded-full">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wallet className="h-4 w-4 text-muted-foreground" /> Monthly Net Balance
              </CardTitle>
              <CardDescription>Net balance (income minus expenses) per month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 pt-1">
                {monthlyTrend.slice(-6).map((m, i) => {
                  const net = m.income - m.expenses;
                  const maxAbs = Math.max(...monthlyTrend.map(x => Math.abs(x.income - x.expenses)), 1);
                  const pct = Math.abs(net) / maxAbs * 100;
                  return (
                    <motion.div
                      key={m.month}
                      className="space-y-1"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.07, duration: 0.38 }}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">{m.month}</span>
                        <span className={`font-semibold ${net >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                          {net >= 0 ? "+" : "−"}{formatCurrency(Math.abs(net))}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${net >= 0 ? "bg-emerald-500" : "bg-red-500"}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.5 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
