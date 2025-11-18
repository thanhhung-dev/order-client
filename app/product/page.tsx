import { Product, columns } from "./columns";
import { DataTable } from "./data-table";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/ui/site-header";

export default function ProductPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-3">
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <h2 className="text-sm text-muted-foreground">
            Home / Products / All Products
          </h2>

          {/* Chỉ truyền columns, không cần data nữa */}
          <DataTable columns={columns} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
