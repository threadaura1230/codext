import React from "react";

const AdminFooter = () => {
  return (
    <footer className="p-8 border-t border-border bg-background/50 text-center">
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Codext Admin Portal. All rights reserved.
        <span className="ml-4 text-xs font-mono bg-muted px-2 py-1 rounded">v1.0.0</span>
      </p>
    </footer>
  );
};

export default AdminFooter;
