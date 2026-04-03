export const CATEGORIES = [
  "Food & Dining",
  "Housing",
  "Transport",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Utilities",
  "Education",
  "Salary",
  "Freelance",
  "Investment",
  "Other",
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, title: "Monthly Salary", amount: 95000, type: "income", category: "Salary", date: "2026-04-01", note: "April salary deposit" },
  { id: 2, title: "Office Rent", amount: 22000, type: "expense", category: "Housing", date: "2026-04-01", note: "Monthly office space" },
  { id: 3, title: "Freelance Project — Zorvyn UI", amount: 18500, type: "income", category: "Freelance", date: "2026-03-28", note: "Full redesign delivery" },
  { id: 4, title: "Grocery Shopping", amount: 3800, type: "expense", category: "Food & Dining", date: "2026-03-30", note: "Weekly groceries" },
  { id: 5, title: "Electricity Bill", amount: 2100, type: "expense", category: "Utilities", date: "2026-03-29", note: "Monthly electricity" },
  { id: 6, title: "Netflix Subscription", amount: 649, type: "expense", category: "Entertainment", date: "2026-03-28", note: "Monthly plan" },
  { id: 7, title: "Uber Rides", amount: 2400, type: "expense", category: "Transport", date: "2026-03-27", note: "Weekly commute" },
  { id: 8, title: "Health Insurance Premium", amount: 5200, type: "expense", category: "Healthcare", date: "2026-03-26", note: "Monthly premium" },
  { id: 9, title: "Online Course — React Advanced", amount: 3999, type: "expense", category: "Education", date: "2026-03-25", note: "Udemy course" },
  { id: 10, title: "Zomato & Swiggy Orders", amount: 2100, type: "expense", category: "Food & Dining", date: "2026-03-24", note: "Food delivery" },
  { id: 11, title: "Investment Returns — SIP", amount: 12000, type: "income", category: "Investment", date: "2026-03-23", note: "Monthly SIP returns" },
  { id: 12, title: "Amazon Shopping", amount: 5600, type: "expense", category: "Shopping", date: "2026-03-22", note: "Electronics & household" },
  { id: 13, title: "Monthly Salary", amount: 95000, type: "income", category: "Salary", date: "2026-03-01", note: "March salary deposit" },
  { id: 14, title: "Gym Membership", amount: 2500, type: "expense", category: "Healthcare", date: "2026-03-01", note: "Annual plan monthly" },
  { id: 15, title: "Internet Bill", amount: 1199, type: "expense", category: "Utilities", date: "2026-03-01", note: "Fiber broadband" },
  { id: 16, title: "Restaurant Dinner", amount: 3400, type: "expense", category: "Food & Dining", date: "2026-02-28", note: "Team dinner" },
  { id: 17, title: "Consulting Retainer", amount: 25000, type: "income", category: "Freelance", date: "2026-02-25", note: "Q1 strategy consulting" },
  { id: 18, title: "Mobile Phone Recharge", amount: 699, type: "expense", category: "Utilities", date: "2026-02-20", note: "Postpaid bill" },
  { id: 19, title: "Weekend Trip — Goa", amount: 14500, type: "expense", category: "Entertainment", date: "2026-02-15", note: "Flight and hotel" },
  { id: 20, title: "Monthly Salary", amount: 95000, type: "income", category: "Salary", date: "2026-02-01", note: "February salary" },
  { id: 21, title: "Car Service", amount: 4200, type: "expense", category: "Transport", date: "2026-02-10", note: "Quarterly maintenance" },
  { id: 22, title: "Book Purchase", amount: 1200, type: "expense", category: "Education", date: "2026-02-05", note: "Design & engineering books" },
  { id: 23, title: "Dividend Income", amount: 8400, type: "income", category: "Investment", date: "2026-01-30", note: "Q4 dividends" },
  { id: 24, title: "Monthly Salary", amount: 95000, type: "income", category: "Salary", date: "2026-01-01", note: "January salary" },
  { id: 25, title: "New Year Shopping", amount: 9800, type: "expense", category: "Shopping", date: "2026-01-02", note: "Sale purchases" },
  { id: 26, title: "Spotify Premium", amount: 179, type: "expense", category: "Entertainment", date: "2026-01-05", note: "Monthly plan" },
  { id: 27, title: "Doctor Visit", amount: 1200, type: "expense", category: "Healthcare", date: "2026-01-12", note: "General checkup" },
  { id: 28, title: "Petrol Expenses", amount: 1900, type: "expense", category: "Transport", date: "2026-01-18", note: "Monthly fuel" },
  { id: 29, title: "Monthly Salary", amount: 90000, type: "income", category: "Salary", date: "2025-12-01", note: "December salary" },
  { id: 30, title: "Christmas Shopping", amount: 12000, type: "expense", category: "Shopping", date: "2025-12-20", note: "Gifts and decorations" },
  { id: 31, title: "Annual Software License", amount: 6500, type: "expense", category: "Education", date: "2025-12-10", note: "Figma & design tools" },
  { id: 32, title: "Freelance Bonus", amount: 10000, type: "income", category: "Freelance", date: "2025-12-15", note: "Year-end project bonus" },
  { id: 33, title: "Monthly Salary", amount: 90000, type: "income", category: "Salary", date: "2025-11-01", note: "November salary" },
  { id: 34, title: "Cloud Hosting Bill", amount: 3200, type: "expense", category: "Utilities", date: "2025-11-05", note: "AWS monthly" },
  { id: 35, title: "New Laptop", amount: 88000, type: "expense", category: "Shopping", date: "2025-11-12", note: "MacBook Pro 14 M4" },
  { id: 36, title: "Freelance Dashboard Project", amount: 30000, type: "income", category: "Freelance", date: "2025-11-20", note: "Analytics dashboard delivery" },
  { id: 37, title: "Restaurant Lunch", amount: 1800, type: "expense", category: "Food & Dining", date: "2025-11-18", note: "Client lunch" },
  { id: 38, title: "Movie Tickets", amount: 900, type: "expense", category: "Entertainment", date: "2025-11-22", note: "Weekend outing" },
  { id: 39, title: "Monthly Salary", amount: 90000, type: "income", category: "Salary", date: "2025-10-01", note: "October salary" },
  { id: 40, title: "Dental Treatment", amount: 8500, type: "expense", category: "Healthcare", date: "2025-10-08", note: "Root canal procedure" },
  { id: 41, title: "Flight Tickets", amount: 9200, type: "expense", category: "Transport", date: "2025-10-15", note: "Bangalore — Delhi return" },
  { id: 42, title: "Investment — Gold ETF", amount: 15000, type: "income", category: "Investment", date: "2025-10-20", note: "ETF portfolio returns" },
  { id: 43, title: "Home Decor", amount: 7200, type: "expense", category: "Shopping", date: "2025-10-25", note: "Living room update" },
  { id: 44, title: "Electricity & Water", amount: 2800, type: "expense", category: "Utilities", date: "2025-10-01", note: "Combined utility bill" },
  { id: 45, title: "Monthly Salary", amount: 90000, type: "income", category: "Salary", date: "2025-09-01", note: "September salary" },
  { id: 46, title: "Coffee Shop", amount: 3200, type: "expense", category: "Food & Dining", date: "2025-09-10", note: "Remote work sessions" },
  { id: 47, title: "Professional Certification", amount: 12000, type: "expense", category: "Education", date: "2025-09-15", note: "AWS Solutions Architect" },
  { id: 48, title: "Side Project Revenue", amount: 22000, type: "income", category: "Freelance", date: "2025-09-22", note: "SaaS product subscription" },
  { id: 49, title: "Parking & Tolls", amount: 1400, type: "expense", category: "Transport", date: "2025-09-18", note: "Monthly parking" },
  { id: 50, title: "Gaming Subscription", amount: 499, type: "expense", category: "Entertainment", date: "2025-09-28", note: "Xbox Game Pass" },
  { id: 51, title: "Mutual Fund SIP", amount: 20000, type: "expense", category: "Investment", date: "2025-09-05", note: "Monthly SIP investment" },
  { id: 52, title: "Monthly Salary", amount: 90000, type: "income", category: "Salary", date: "2025-08-01", note: "August salary" },
  { id: 53, title: "New Phone", amount: 55000, type: "expense", category: "Shopping", date: "2025-08-12", note: "iPhone 16 Pro" },
  { id: 54, title: "Freelance SEO Project", amount: 14000, type: "income", category: "Freelance", date: "2025-08-20", note: "3-month SEO retainer" },
  { id: 55, title: "House Maintenance", amount: 6000, type: "expense", category: "Housing", date: "2025-08-25", note: "Plumbing & painting" },
  { id: 56, title: "Grocery Run", amount: 4200, type: "expense", category: "Food & Dining", date: "2025-08-15", note: "Monthly bulk grocery" },
  { id: 57, title: "Pharmacies", amount: 2100, type: "expense", category: "Healthcare", date: "2025-08-10", note: "Medicines & supplements" },
  { id: 58, title: "Stock Market Gains", amount: 18000, type: "income", category: "Investment", date: "2025-08-30", note: "Nifty 50 ETF exit" },
];

export function computeSummary(transactions) {
  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return {
    totalBalance: totalIncome - totalExpenses,
    totalIncome,
    totalExpenses,
    transactionCount: transactions.length,
    incomeCount: transactions.filter(t => t.type === "income").length,
    expenseCount: transactions.filter(t => t.type === "expense").length,
  };
}

export function computeMonthlyTrend(transactions) {
  const map = new Map();
  for (const tx of transactions) {
    const d = new Date(tx.date);
    const sortKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const month = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    if (!map.has(sortKey)) map.set(sortKey, { month, income: 0, expenses: 0, sortKey });
    const entry = map.get(sortKey);
    if (tx.type === "income") entry.income += tx.amount;
    else entry.expenses += tx.amount;
  }
  return Array.from(map.values())
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .slice(-7)
    .map(({ month, income, expenses }) => ({ month, income, expenses, balance: income - expenses }));
}

export function computeCategoryBreakdown(transactions) {
  const expenses = transactions.filter(t => t.type === "expense");
  const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);
  const map = new Map();
  for (const tx of expenses) {
    const e = map.get(tx.category) ?? { amount: 0, count: 0 };
    e.amount += tx.amount;
    e.count += 1;
    map.set(tx.category, e);
  }
  return Array.from(map.entries())
    .map(([category, { amount, count }]) => ({
      category,
      amount,
      count,
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function computeTopInsights(transactions) {
  const breakdown = computeCategoryBreakdown(transactions);
  const top = breakdown[0];
  const byMonth = computeMonthlyTrend(transactions);
  const avgIncome = byMonth.length ? byMonth.reduce((s, m) => s + m.income, 0) / byMonth.length : 0;
  const avgExpense = byMonth.length ? byMonth.reduce((s, m) => s + m.expenses, 0) / byMonth.length : 0;
  const savingsRate = avgIncome > 0 ? Math.round(((avgIncome - avgExpense) / avgIncome) * 1000) / 10 : 0;
  const last = byMonth[byMonth.length - 1];
  const prev = byMonth[byMonth.length - 2];
  const mom = prev && prev.expenses > 0 ? Math.round(((last.expenses - prev.expenses) / prev.expenses) * 1000) / 10 : 0;
  return {
    topSpendingCategory: top?.category ?? "N/A",
    topSpendingAmount: top?.amount ?? 0,
    avgMonthlyIncome: avgIncome,
    avgMonthlyExpense: avgExpense,
    savingsRate,
    monthOverMonthChange: mom,
  };
}
