import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { ICategoryProps, ITransactionProps } from "@/lib/interface";
import { publicURL } from "@/lib/utils";

const EditTransaction = ({
  transaction,
  handleFetchTransactions,
  closeModal,
  allCategories,
}: {
  transaction: ITransactionProps;
  handleFetchTransactions: () => Promise<void>;
  closeModal: () => void;
  allCategories: ICategoryProps[];
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: transaction.amount,
    date: transaction.date,
    description: transaction.description,
    category: transaction.category.name,
    type: transaction.type,
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("formdata: ", formData);
    try {
      const editResponse = await axios.put(
        `${publicURL}/api/transactions/edit/${transaction._id}`,
        formData,
      );
      if (editResponse.status === 200) {
        console.log("successfully edited a transaction");
        await handleFetchTransactions();
        closeModal();
      }
    } catch (error) {
      console.error("Error while editing data: ", error);
      setError("Failed to edit data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleEditData} className="space-y-4 p-2 w-full mx-auto">
      <div>
        <Label htmlFor="amount" className="pb-2">
          Amount
        </Label>
        <Input
          id="amount"
          type="number"
          defaultValue={transaction.amount}
          onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="date" className="pb-2">
          Date
        </Label>
        <Input
          id="date"
          type="date"
          defaultValue={transaction.date.split("T")[0]}
          onChange={(e) => handleChange("date", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description" className="pb-2">
          Description
        </Label>
        <Textarea
          id="description"
          defaultValue={transaction.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="category" className="pb-2">
          Category
        </Label>
        <Select
          defaultValue={transaction.category.name}
          onValueChange={(value) => handleChange("category", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {allCategories.map((c, index) => (
              <SelectItem value={c.name} key={index} className="flex flex-row justify-between">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: c.color }} />
                <div className=""><p className="">{c.name}</p></div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="pb-2">Type</Label>
        <RadioGroup
          defaultValue={transaction.type}
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

      <DialogFooter>
        {loading ? (
          <Button disabled>
            <Loader2 className="animate-spin" />
            Please Wait...
          </Button>
        ) : (
          <Button type="submit">Save Changes</Button>
        )}
        {error && (
          <div className="w-full flex justify-center items-center">
            <p className="text-red-500 font-semibold">{error}</p>
          </div>
        )}
      </DialogFooter>
    </form>
  );
};

export default EditTransaction;
