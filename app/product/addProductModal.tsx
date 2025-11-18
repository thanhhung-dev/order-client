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
import { IconPlus, IconUpload } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
}

interface AddProductModalProps {
  onProductAdded?: () => void;
}

const AddProductModal = ({ onProductAdded }: AddProductModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    status: "1",
  });

  // Fetch categories khi mở modal
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://ordercoffeebe.onrender.com/api/category"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.price ||
      !formData.categoryId ||
      !imageFile
    ) {
      alert("Please fill in all required fields and upload an image");
      return;
    }

    setLoading(true);
    try {
      // Upload image first
      const formDataImage = new FormData();
      formDataImage.append("file", imageFile);

      const uploadResponse = await fetch(
        "https://ordercoffeebe.onrender.com/api/upload",
        {
          method: "POST",
          body: formDataImage,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const imageUrl = await uploadResponse.text();

      // Create product
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        image: imageUrl,
        status: parseInt(formData.status),
        category: {
          id: parseInt(formData.categoryId),
        },
      };

      const response = await fetch(
        "https://ordercoffeebe.onrender.com/api/product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        status: "1",
      });
      setImageFile(null);
      setImagePreview("");
      setOpen(false);

      // Callback để reload data
      if (onProductAdded) {
        onProductAdded();
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
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
          <span className="hidden lg:inline">Add New Product</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Please complete the following form to add a new product!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Cappuccino"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="Product description..."
              value={formData.description}
              onChange={handleInputChange}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">
              Price (VND) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="e.g. 50000"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="categoryId">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, categoryId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <SelectItem value="1">Active</SelectItem>
                <SelectItem value="0">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">
              Product Image <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => document.getElementById("image")?.click()}
              >
                <IconUpload className="h-4 w-4" />
              </Button>
            </div>
            {imagePreview && (
              <div className="mt-2 relative w-full h-48 border rounded-md overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
