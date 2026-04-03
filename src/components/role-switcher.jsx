import { useRole } from "@/contexts/role-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ShieldAlert, User, ChevronDown } from "lucide-react";

export function RoleSwitcher() {
  const { role, setRole } = useRole();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" size="sm">
          {role === "admin" ? <ShieldAlert className="h-4 w-4 text-emerald-600" /> : <User className="h-4 w-4 text-slate-500" />}
          <span className="capitalize hidden sm:inline">{role}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setRole("viewer")} className="gap-2 cursor-pointer">
          <User className="h-4 w-4" /> Viewer (Read-only)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setRole("admin")} className="gap-2 cursor-pointer">
          <ShieldAlert className="h-4 w-4" /> Admin (Full access)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
