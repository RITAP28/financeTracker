import { ActiveButton } from "@/lib/utils";
import {
  ArrowLeftRight,
  ChartColumnDecreasing,
  ChartPie,
  House,
} from "lucide-react";

export default function Button({
  type,
  active,
  setActive,
}: {
  type: ActiveButton;
  active: ActiveButton;
  setActive: React.Dispatch<React.SetStateAction<ActiveButton>>;
}) {
  return (
    <button
      type="button"
      className={`flex flex-row gap-2 items-center border-[0.5px] border-black px-2 py-1 rounded-md ${
        active === type ? "bg-blue-500 text-white font-semibold" : "bg-white text-slate-500 font-normal"
      } hover:cursor-pointer text-black transition duration-200 ease-in-out`}
      onClick={() => {
        setActive(type);
      }}
    >
      {type === ActiveButton.dashboard ? (
        <House className="w-4 h-4" />
      ) : type === ActiveButton.transactions ? (
        <ArrowLeftRight className="w-4 h-4" />
      ) : type === ActiveButton.categories ? (
        <ChartPie className="w-4 h-4" />
      ) : (
        <ChartColumnDecreasing className="w-4 h-4" />
      )}
      {type}
    </button>
  );
}
