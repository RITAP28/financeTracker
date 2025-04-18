import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ICategoryProps } from "@/lib/interface";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Loader2 } from "lucide-react";

const AddTransactionForm = ({
  handleSubmit,
  handleChange,
  formData,
  allCategories,
  loading,
}: {
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleChange: (field: string, value: string) => void;
  formData: {
    amount: string;
    date: string;
    description: string;
    category: string;
    type: string;
  };
  allCategories: ICategoryProps[];
  loading: boolean;
}) => {
  return (
    <div className="items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="hover:cursor-pointer">Add Transaction</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>
            <div className="text-center sm:text-left space-y-1 sm:space-y-0">
              <p className="font-semibold text-base sm:text-lg">
                Add Transaction
              </p>
              <p className="font-light text-sm sm:text-base text-slate-500">
                Enter the details for your new transaction
              </p>
            </div>
          </DialogTitle>

          <form
            onSubmit={handleSubmit}
            className="space-y-2 p-2 w-full mx-auto"
          >
            <div>
              <Label htmlFor="amount" className="mb-2">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="date" className="mb-2 mt-2">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="mb-2 mt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Add a description"
                required
              />
            </div>

            <div>
              <Label htmlFor="category" className="mb-2 mt-2">
                Category
              </Label>
              <Select
                onValueChange={(value) => handleChange("category", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((c, index) => (
                    <SelectItem value={c.name} key={index}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 mt-2">Type</Label>
              <RadioGroup
                defaultValue="Expense"
                onValueChange={(value) => handleChange("type", value)}
                className="flex space-x-4 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Expense" id="expense" />
                  <Label htmlFor="expense">Expense</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Income" id="income" />
                  <Label htmlFor="income">Income</Label>
                </div>
              </RadioGroup>
            </div>
            {loading ? (
              <Button disabled>
                <Loader2 className="animate-spin" />
                Please Wait...
              </Button>
            ) : (
              <Button type="submit" className="w-full mt-2">
                Add
              </Button>
            )}
          </form>
          <DialogFooter className="sm:justify-start"></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTransactionForm;
