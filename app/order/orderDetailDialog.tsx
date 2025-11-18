"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "./columns";

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDetailDialog = ({
  order,
  open,
  onOpenChange,
}: OrderDetailDialogProps) => {
  if (!order) return null;

  const statusConfig: Record<
    string,
    { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
  > = {
    pending: { variant: "secondary", label: "Pending" },
    preparing: { variant: "outline", label: "Preparing" },
    ready: { variant: "default", label: "Ready" },
    completed: { variant: "default", label: "Completed" },
    cancelled: { variant: "destructive", label: "Cancelled" },
  };

  const config = statusConfig[order.status?.toLowerCase()] || {
    variant: "secondary",
    label: order.status,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Order Details</DialogTitle>
          <DialogDescription>
            Order ID: #{order.id} | Created at:{" "}
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Table
              </div>
              <div className="text-lg font-semibold">{order.table?.name}</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Status
              </div>
              <div>
                <Badge variant={config.variant} className="text-base px-3 py-1">
                  {config.label}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Total Amount
              </div>
              <div className="text-lg font-semibold text-primary">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order.total_amount)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Deleted
              </div>
              <div>
                <Badge
                  variant={order.deleted === 0 ? "default" : "destructive"}
                >
                  {order.deleted === 0 ? "Active" : "Deleted"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Order Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">No.</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {item.product?.name || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{item.quantity}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.product?.price || 0)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.subtotal)}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {item.notes || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        No items in this order
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Items:</span>
              <span className="font-medium">
                {order.items?.reduce((sum, item) => sum + item.quantity, 0) ||
                  0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Number of Products:</span>
              <span className="font-medium">{order.items?.length || 0}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-primary">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order.total_amount)}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
