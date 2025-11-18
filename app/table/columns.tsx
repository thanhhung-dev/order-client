"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

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

export type Table = {
  id: number;
  name: string;
  capacity?: number;
  status?: string;
  createdAt?: string;
};

export const columns: ColumnDef<Table>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Table Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <div className="font-medium">{name}</div>;
    },
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => {
      const capacity = row.getValue("capacity") as number;
      return capacity ? (
        <Badge variant="outline">{capacity} people</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig: Record<
        string,
        { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
      > = {
        available: { variant: "default", label: "Available" },
        occupied: { variant: "destructive", label: "Occupied" },
        reserved: { variant: "secondary", label: "Reserved" },
        maintenance: { variant: "outline", label: "Maintenance" },
      };
      const config = statusConfig[status?.toLowerCase()] || {
        variant: "secondary",
        label: status || "N/A",
      };
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      if (!date) return <span className="text-muted-foreground">-</span>;
      return <div>{new Date(date).toLocaleDateString("vi-VN")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const table = row.original;
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
              onClick={() => navigator.clipboard.writeText(table.id.toString())}
            >
              Copy Table ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
