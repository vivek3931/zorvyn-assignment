import { createContext, useContext, useState } from "react";

const RoleContext = createContext(undefined);

export function RoleProvider({ children }) {
  const [role, setRoleState] = useState(() => {
    const saved = localStorage.getItem("app-role");
    return saved || "viewer";
  });

  const setRole = (newRole) => {
    setRoleState(newRole);
    localStorage.setItem("app-role", newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRole must be used within RoleProvider");
  return context;
}
