// components/booking/ItemSelection.tsx
"use client";

import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Import Button for quantity controls
import { cn } from "@/lib/utils";
import { IProduct } from "@/types"; // Assuming your product type is defined here
import { ArrowUp, ArrowDown } from "lucide-react"; // Icons for quantity

// Define the type for the data this form will submit
interface ItemSelectionFormData {
  // Use a record to map product ID to quantity
  [productId: string]: number;
}

// Define the type for the selected items *saved to the store/API payload*
// This matches the API's required format
interface SelectedItem {
  productId: string;
  quantity: number;
  name?: string; // Include name for display purposes
}

interface ItemSelectionProps {
  products: IProduct[]; // List of available products fetched from API
  onSuccess: (items: SelectedItem[]) => void; // Callback to pass selected items back
  defaultSelectedItems: SelectedItem[]; // Default values from store
}

const ItemSelection: React.FC<ItemSelectionProps> = ({
  products,
  onSuccess,
  defaultSelectedItems,
}) => {
  // Convert defaultSelectedItems (from store) into the form data structure { [productId]: quantity }
  const defaultValues = defaultSelectedItems.reduce((acc, item) => {
    acc[item.productId] = item.quantity;
    return acc;
  }, {} as ItemSelectionFormData);

  const {
    control, // Use control for quantity inputs as they are numbers and potentially need validation/parsing
    handleSubmit,
    formState: { errors },
    watch, // Watch quantities
    setValue, // Set quantities
  } = useForm<ItemSelectionFormData>({
    defaultValues: defaultValues, // Set initial quantities from store
    mode: "onChange", // Validate/update as quantity changes
  });

  // Watch all item quantities
  const watchedQuantities = watch();

  // Helper to handle quantity change
  const handleQuantityChange = (productId: string, change: number) => {
    const currentQuantity = watchedQuantities[productId] || 0;
    const newQuantity = Math.max(0, currentQuantity + change); // Ensure quantity doesn't go below 0
    setValue(productId, newQuantity, { shouldValidate: true }); // Update form state
  };

  // This function is called by handleSubmit when the form is submitted (via the "Next" button in page.tsx)
  const onSubmit: SubmitHandler<ItemSelectionFormData> = (data) => {
    // Convert the form data { [productId]: quantity } into the required API/Store format { productId, quantity, name }[]
    const selectedItems = products.map((product) => {
      const quantity = data[product._id] || 0; // Get quantity for this product, default to 0
      return {
        productId: product._id,
        quantity: quantity,
        name: product.name, // Include name for display
      };
    });

    // Pass the selected items back to the parent
    onSuccess(selectedItems);
  };

  return (
    // The form element needs an ID
    <form
      id="itemSelectionForm"
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-sm rounded p-6 mb-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Item Selection
      </h2>
      {/* Optional: Add instructions */}
      <p className="text-gray-600 text-sm mb-6">
        Please select the items you need and specify the desired quantity for
        each.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border border-gray-200 rounded-lg p-4 flex flex-col"
          >
            {/* Optional: Display product image if available */}
            {/* {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover rounded-md mb-3" />} */}
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {product.name}
            </h3>
            {/* Optional: Display description/details */}
            {/* {product.description && <p className="text-gray-600 text-sm mb-3">{product.description}</p>} */}

            {/* Quantity Control */}
            <div className="flex flex-col gap-3 items-center justify-between mt-auto pt-4 border-t border-gray-100">
              {" "}
              {/* Use mt-auto to push to bottom */}
              <Label
                htmlFor={`quantity-${product._id}`}
                className="text-sm text-gray-700"
              >
                Quantity:
              </Label>
              <div className="flex items-center">
                {/* Decrease button */}
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-l-md rounded-r-none"
                  onClick={() => handleQuantityChange(product._id, -1)}
                  disabled={
                    watchedQuantities[product._id] <= 0 ||
                    !watchedQuantities[product._id]
                  } // Disable if quantity is 0 or undefined
                  type="button" // Important: Prevent this button from submitting the form
                >
                  <ArrowDown size={16} />
                </Button>
                {/* Quantity Input */}
                {/* Use Controller for number input for better type handling and validation */}
                <Controller
                  name={product._id} // The field name is the product ID
                  control={control}
                  rules={{
                    min: { value: 0, message: "Quantity cannot be negative" },
                  }} // Basic validation
                  render={({ field }) => (
                    <Input
                      id={`quantity-${product._id}`}
                      type="number"
                      min="0"
                      // RHF field props handle value, onChange, onBlur etc.
                      {...field}
                      // Ensure value is treated as number for RHF
                      value={field.value || 0} // Default to 0 if undefined/null
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      } // Parse input value to number
                      className={cn(
                        "w-16 text-center border-y border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none",
                        errors[product._id] && "border-red-500" // Error styling
                      )}
                      // Prevent direct text input, force numbers via buttons
                      // readOnly
                    />
                  )}
                />
                {/* Increase button */}
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-r-md rounded-l-none"
                  onClick={() => handleQuantityChange(product._id, 1)}
                  type="button" // Important: Prevent this button from submitting the form
                >
                  <ArrowUp size={16} />
                </Button>
              </div>
            </div>
            {/* Display error message for quantity if any */}
            {errors[product._id] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[product._id]?.message}
              </p>
            )}
          </div>
        ))}

        {/* Optional: Add validation message if minimum number of items is required */}
        {/* Example: errors.itemsNeeded?.message && <p className="text-red-500 text-sm mt-3">{errors.itemsNeeded?.message}</p> */}
      </div>
      {/* The "Next" button (in page.tsx) needs type="submit" and form="itemSelectionForm" */}
    </form>
  );
};

export default ItemSelection;
