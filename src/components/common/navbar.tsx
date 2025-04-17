"use client";

import { useState } from "react";
import Button from "./button";
import Link from "next/link";
import { ActiveButton } from "@/lib/enums";

export default function Navbar() {
  const [active, setActive] = useState<ActiveButton>(ActiveButton.dashboard);
  return (
    <div className="w-full flex justify-between items-center px-4 py-4 border-b-[0.5px] border-b-slate-200 bg-white">
      <div className="">
        <p className="font-semibold">FinanceViz</p>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <Link href="/">
          <Button
            type={ActiveButton.dashboard}
            active={active}
            setActive={setActive}
          />
        </Link>
        <Link href="/transactions">
          <Button
            type={ActiveButton.transactions}
            active={active}
            setActive={setActive}
          />
        </Link>
        <Link href="/categories">
          <Button
            type={ActiveButton.categories}
            active={active}
            setActive={setActive}
          />
        </Link>
        <Link href="/budget">
          <Button
            type={ActiveButton.budget}
            active={active}
            setActive={setActive}
          />
        </Link>
      </div>
    </div>
  );
}
