"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Table {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface OrderItemForm {
  productId: string;
  quantity: number;
  notes: string;
}

interface AddOrderModalProps {
  onOrderAdded?: () => void;
}

const AddOrderModal = ({ onOrderAdded }: AddOrderModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState<Table[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTableId, setSelectedTableId] = useState("");
  const [status, setStatus] = useState("pending");
  const [orderItems, setOrderItems] = useState<OrderItemForm[]>([
    { productId: "", quantity: 1, notes: "" },
  ]);

  // Fetch tables và products khi mở modal
  useEffect(() => {
    if (open) {
      fetchTables();
      fetchProducts();
    }
  }, [open]);

  const fetchTables = async () => {
    try {
      const response = await fetch(
        "https://ordercoffeebe.onrender.com/api/table"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tables");
      }
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://ordercoffeebe.onrender.com/api/product"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { productId: "", quantity: 1, notes: "" }]);
  };

  const removeOrderItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const updateOrderItem = (
    index: number,
    field: keyof OrderItemForm,
    value: string | number
  ) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setOrderItems(newItems);
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const product = products.find((p) => p.id.toString() === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!selectedTableId || orderItems.some((item) => !item.productId)) {
      alert("Please select a table and add at least one product");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        table: {
          id: parseInt(selectedTableId),
        },
        status: status,
        total_amount: calculateTotal(),
        deleted: 0,
        items: orderItems.map((item) => {
          const product = products.find(
            (p) => p.id.toString() === item.productId
          );
          return {
            product: {
              id: parseInt(item.productId),
            },
            quantity: item.quantity,
            subtotal: product ? product.price * item.quantity : 0,
            notes: item.notes,
          };
        }),
      };

      const response = await fetch(
        "https://ordercoffeebe.onrender.com/api/order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      // Reset form
      setSelectedTableId("");
      setStatus("pending");
      setOrderItems([{ productId: "", quantity: 1, notes: "" }]);
      setOpen(false);

      // Callback để reload data
      if (onOrderAdded) {
        onOrderAdded();
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-4 text-base"
        >
          <IconPlus />
          <span className="hidden lg:inline">Create New Order</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Select a table and add products to create a new order.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Table Selection */}
          <div className="space-y-2">
            <Label htmlFor="tableId">
              Table <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedTableId} onValueChange={setSelectedTableId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a table" />
              </SelectTrigger>
              <SelectContent>
                {tables.map((table) => (
                  <SelectItem key={table.id} value={table.id.toString()}>
                    {table.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Order Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>
                Order Items <span className="text-red-500">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOrderItem}
              >
                <IconPlus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-3 bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Item #{index + 1}
                    </span>
                    {orderItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOrderItem(index)}
                      >
                        <IconTrash className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Product</Label>
                      <Select
                        value={item.productId}
                        onValueChange={(value) =>
                          updateOrderItem(index, "productId", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem
                              key={product.id}
                              value={product.id.toString()}
                            >
                              {product.name} -{" "}
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(product.price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateOrderItem(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input
                      placeholder="Special instructions..."
                      value={item.notes}
                      onChange={(e) =>
                        updateOrderItem(index, "notes", e.target.value)
                      }
                    />
                  </div>

                  {item.productId && (
                    <div className="text-sm text-right font-medium">
                      Subtotal:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(
                        (products.find(
                          (p) => p.id.toString() === item.productId
                        )?.price || 0) * item.quantity
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount:</span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(calculateTotal())}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderModal;
