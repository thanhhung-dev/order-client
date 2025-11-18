"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export type OrderItem = {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
  subtotal: number;
  notes: string;
  createdAt: string;
};

export type Order = {
  id: number;
  table: {
    id: number;
    name: string;
  };
  status: string;
  total_amount: number;
  createdAt: string;
  deleted: number;
  items: OrderItem[];
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "table",
    header: "Table",
    cell: ({ row }) => {
      const table = row.getValue("table") as Order["table"];
      return <div className="font-medium">{table?.name || "N/A"}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
        pending: { variant: "secondary", label: "Pending" },
        preparing: { variant: "outline", label: "Preparing" },
        ready: { variant: "default", label: "Ready" },
        completed: { variant: "default", label: "Completed" },
        cancelled: { variant: "destructive", label: "Cancelled" },
      };
      const config = statusConfig[status?.toLowerCase()] || { variant: "secondary", label: status };
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.getValue("items") as OrderItem[];
      return <div className="text-center">{items?.length || 0}</div>;
    },
  },
  {
    accessorKey: "total_amount",
    header: "Total Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_amount"));
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div>
          <div>{date.toLocaleDateString("vi-VN")}</div>
          <div className="text-xs text-muted-foreground">
            {date.toLocaleTimeString("vi-VN")}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "deleted",
    header: "Deleted",
    cell: ({ row }) => {
      const deleted = row.getValue("deleted") as number;
      return (
        <Badge variant={deleted === 0 ? "default" : "destructive"}>
          {deleted === 0 ? "Active" : "Deleted"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id.toString())}
            >
              Copy Order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Status</DropdownMenuItem>
            <DropdownMenuItem>Cancel Order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
