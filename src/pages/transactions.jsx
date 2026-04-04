import { useState, useMemo } from "react";
import { useDataStore } from "@/contexts/data-store";
import { useRole } from "@/contexts/role-provider";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Trash2, Edit2, ArrowUpDown, ChevronLeft, ChevronRight, Download, CheckCircle2 } from "lucide-react";
import { TransactionDialog } from "@/components/transaction-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES } from "@/lib/mock-data";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

const PAGE_SIZE = 10;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: 16, transition: { duration: 0.2 } },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function Transactions() {
  const { transactions, deleteTransaction } = useDataStore();
  const { role } = useRole();

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
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

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search) list = list.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    if (filterCategory !== "all") list = list.filter(t => t.category === filterCategory);
    if (filterType !== "all") list = list.filter(t => t.type === filterType);
    list.sort((a, b) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      const cmp = typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [transactions, search, filterCategory, filterType, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
    setPage(1);
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setTimeout(() => {
      deleteTransaction(id);
      setDeletingId(null);
    }, 280);
  };

  const openEdit = (tx) => { setEditingTransaction(tx); setDialogOpen(true); };
  const openCreate = () => { setEditingTransaction(null); setDialogOpen(true); };

  const resetFilters = () => { setSearch(""); setFilterCategory("all"); setFilterType("all"); setPage(1); };

  return (
    <motion.div className="space-y-5" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={headerVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1">
            {filtered.length} of {transactions.length} records
          </p>
        </div>
        {role === "admin" && (
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
              <Button
                onClick={handleExportCSV}
                variant="outline"
                size="sm"
                className="gap-2 h-9 relative  overflow-hidden text-xs font-medium"
              >
                <AnimatePresence mode="wait">
                  {exported ? (
                    <motion.span
                      key="done"
                      className="flex items-center  gap-1.5"
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
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button onClick={openCreate} className="gap-2 h-9">
                <Plus className="h-4 w-4" /> Add Transaction
              </Button>
            </motion.div>
          </div>
        )}
      </motion.div>

      <motion.div variants={headerVariants} className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8 h-9 text-sm"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={filterCategory} onValueChange={(v) => { setFilterCategory(v); setPage(1); }}>
          <SelectTrigger className="h-9 w-[155px] text-sm">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
          <SelectTrigger className="h-9 w-[120px] text-sm">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        {(search || filterCategory !== "all" || filterType !== "all") && (
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}>
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9 text-muted-foreground">
              Clear filters
            </Button>
          </motion.div>
        )}
      </motion.div>

      <motion.div variants={headerVariants} className="rounded-lg border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[110px] cursor-pointer select-none" onClick={() => handleSort("date")}>
                <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide">
                  Date <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("title")}>
                <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide">
                  Title <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Category</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Type</TableHead>
              <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort("amount")}>
                <div className="flex items-center justify-end gap-1 text-xs font-semibold uppercase tracking-wide">
                  Amount <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              {role === "admin" && (
                <TableHead className="text-xs font-semibold uppercase tracking-wide w-[90px] text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="wait">
              {paginated.length === 0 ? (
                <TableRow key="empty">
                  <TableCell colSpan={role === "admin" ? 6 : 5} className="h-40 text-center text-muted-foreground">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 opacity-30" />
                      <span>No transactions found.</span>
                    </motion.div>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((tx) => (
                  <motion.tr
                    key={tx.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate={deletingId === tx.id ? "exit" : "visible"}
                    exit="exit"
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors duration-150 cursor-default"
                  >
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap font-medium py-3">
                      {format(new Date(tx.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="font-medium text-sm leading-tight">{tx.title}</div>
                      {tx.note && <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{tx.note}</div>}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant="secondary" className="font-normal text-xs">{tx.category}</Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <motion.span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          tx.type === "income"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {tx.type === "income" ? "▲" : "▼"}
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </motion.span>
                    </TableCell>
                    <TableCell className="text-right py-3">
                      <span className={`font-bold text-sm ${tx.type === "income" ? "text-emerald-600" : "text-foreground"}`}>
                        {tx.type === "income" ? "+" : "−"}{formatCurrency(tx.amount)}
                      </span>
                    </TableCell>
                    {role === "admin" && (
                      <TableCell className="py-3">
                        <div className="flex justify-end gap-1">
                          <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="icon" onClick={() => openEdit(tx)} className="h-7 w-7">
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(tx.id)} className="h-7 w-7 hover:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </motion.div>
                        </div>
                      </TableCell>
                    )}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>

      <motion.div variants={headerVariants} className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <div className="text-xs text-muted-foreground w-full sm:w-auto text-center sm:text-left">
          Showing <span className="font-medium text-foreground">{Math.min((safePage - 1) * PAGE_SIZE + 1, filtered.length)}</span>
          {" – "}
          <span className="font-medium text-foreground">{Math.min(safePage * PAGE_SIZE, filtered.length)}</span>
          {" of "}
          <span className="font-medium text-foreground">{filtered.length}</span> results
        </div>
        <div className="flex items-center justify-center gap-1 w-full sm:w-auto">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </motion.div>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && p - arr[idx - 1] * 1 > 1) acc.push("…");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "…" ? (
                <span key={`ellipsis-${i}`} className="text-xs text-muted-foreground px-1">…</span>
              ) : (
                <motion.div key={p} whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.93 }}>
                  <Button
                    variant={safePage === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(p)}
                    className="h-8 w-8 p-0 text-xs"
                  >
                    {p}
                  </Button>
                </motion.div>
              )
            )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} transaction={editingTransaction} />
    </motion.div>
  );
}
