"use client";

import { useState } from "react";
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
import { IconPlus } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddTableModalProps {
  onTableAdded?: () => void;
}

const AddTableModal = ({ onTableAdded }: AddTableModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    status: "available",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      alert("Please enter table name");
      return;
    }

    setLoading(true);
    try {
      const tableData = {
        name: formData.name,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        status: formData.status,
      };

      const response = await fetch(
        "https://ordercoffeebe.onrender.com/api/table",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tableData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create table");
      }

      // Reset form
      setFormData({
        name: "",
        capacity: "",
        status: "available",
      });
      setOpen(false);

      // Callback để reload data
      if (onTableAdded) {
        onTableAdded();
      }
    } catch (error) {
      console.error("Error creating table:", error);
      alert("Failed to create table. Please try again.");
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
          <span className="hidden lg:inline">Add New Table</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Table</DialogTitle>
          <DialogDescription>
            Please complete the following form to add a new table!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Table Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Table Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Table 1, VIP Room A"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity (people)</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              placeholder="e.g. 4, 6, 8"
              value={formData.capacity}
              onChange={handleInputChange}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Table"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTableModal;
