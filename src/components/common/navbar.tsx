"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import React from "react";
import {UserButton} from "@clerk/nextjs";

const routes = [
  {
    label: "Dashboard",
    href: "/",
  },
  {
    label: "Billboards",
    href: "/billboards",
  },
  {
    label: "Categories",
    href: "/categories",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Orders",
    href: "/orders",
  },
];
function Navbar() {
  const pathname = usePathname();

  const isActive = (route: string) => {
    return pathname === route;
  };
  return (
    <nav className={`bg-white text-gray-800 border-b border-gray-200`}>
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between p-4">
        <div className="text-lg font-bold">e-shop</div>
        <ul className="flex space-x-4">
          {routes.map((route) => (
            <Link
              key={route.label}
              href={route.href}
              className={`hover:text-gray-900 ${
                isActive(route.href)
                  ? "text-black dark:text-white"
                  : "text-gray-600"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </ul>
        <div className="flex items-center space-x-4">
          <UserButton />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
