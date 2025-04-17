import { ITransactionProps } from "@/lib/interface";
import { Button } from "../ui/button";
import Link from "next/link";
import { Type } from "@/lib/enums";

const RecentTransactionsList = ({
  allTransactions,
  loading,
  error,
}: {
  allTransactions: ITransactionProps[];
  loading: boolean;
  error: string | null;
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  return (
    <div className="w-full flex flex-col p-4 border-[0.5px] border-slate-300 rounded-md shadow-sm">
      <div className="w-full tracking-tight pb-2">
        <h2 className="text-[1.5rem] font-bold">Recent Transactions</h2>
        <p className="text-sm font-light text-slate-500">
          Your latest financial activity
        </p>
      </div>
      {loading ? (
        <div className="w-full py-4">
          <p className="text-sm font-bold text-slate-500">
            Loading your transactions...
          </p>
        </div>
      ) : error ? (
        <div className="w-full py-4">
          <p className="text-red-500 font-semibold text-sm">{error}</p>
        </div>
      ) : (
        allTransactions.slice(0, 4).map((t, index) => (
          <div
            className="w-full flex justify-between items-center py-1"
            key={index}
          >
            <div className="flex flex-col">
              <p className="text-sm font-semibold">{t.description}</p>
              <p className="flex flex-row items-center text-sm font-light text-slate-500">
                {formatDate(t.date)} | {t.category.name}
              </p>
            </div>
            <div className="">
              {t.type === Type.income ? (
                <p className="text-sm font-semibold text-green-500">
                  + ₹{t.amount}
                </p>
              ) : (
                <p className="text-sm font-semibold text-red-500">
                  - ₹{t.amount}
                </p>
              )}
            </div>
          </div>
        ))
      )}
      <div className="w-full flex justify-center items-center">
        <Link href="/transactions">
            <Button className="hover:cursor-pointer">Show More</Button>
        </Link>
      </div>
    </div>
  );
};

export default RecentTransactionsList;
