"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddOrderModal from "./addOrderModal";
import OrderDetailDialog from "./orderDetailDialog";
import { Order } from "./columns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = React.useState<TData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://ordercoffeebe.onrender.com/api/order"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const orders = await response.json();
      setData(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data khi component mount
  React.useEffect(() => {
    fetchOrders();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  // Hàm để reload data sau khi thêm mới
  const handleOrderAdded = () => {
    fetchOrders();
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between py-4 gap-4">
        <Input
          placeholder="Search by table name..."
          value={(table.getColumn("table")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("table")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <AddOrderModal onOrderAdded={handleOrderAdded} />
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewDetails(row.original as Order)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        order={selectedOrder}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </div>
  );
}
