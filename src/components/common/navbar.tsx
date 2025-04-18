"use client";

import { useState } from "react";
import Button from "./button";
import Link from "next/link";
import { ActiveButton } from "@/lib/enums";
import { Menu, X } from "lucide-react"; // icon lib like lucide-react

export default function Navbar() {
  const [active, setActive] = useState<ActiveButton>(ActiveButton.dashboard);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="w-full border-b-[0.5px] border-b-slate-200 bg-white px-4 py-4">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg">FinanceViz</p>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-4 items-center">
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

      {/* Mobile Nav Links (Dropdown) */}
      {isOpen && (
        <div className="flex flex-col md:hidden mt-4 gap-2">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Button
              type={ActiveButton.dashboard}
              active={active}
              setActive={setActive}
            />
          </Link>
          <Link href="/transactions" onClick={() => setIsOpen(false)}>
            <Button
              type={ActiveButton.transactions}
              active={active}
              setActive={setActive}
            />
          </Link>
          <Link href="/categories" onClick={() => setIsOpen(false)}>
            <Button
              type={ActiveButton.categories}
              active={active}
              setActive={setActive}
            />
          </Link>
          <Link href="/budget" onClick={() => setIsOpen(false)}>
            <Button
              type={ActiveButton.budget}
              active={active}
              setActive={setActive}
            />
          </Link>
        </div>
      )}
    </nav>
  );
}
