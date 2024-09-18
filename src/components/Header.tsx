"use client";

import { House, LibraryBig, UserRound } from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const Header = () => {
  const currentPath = usePathname();

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-center hidden sm:flex">
        <a className="btn btn-ghost text-xl">Lycée Agustin</a>
      </div>
      <div className="navbar-start"></div>

      <div className="navbar-end">
        <Link href="/home">
          <button
            className={`btn btn-ghost btn-circle ${
              currentPath === "/home" ? "bg-blue-200" : ""
            }`}
          >
            <div className="indicator">
              <House />
            </div>
          </button>
        </Link>

        <Link href="/profil">
          <button
            className={`btn btn-ghost btn-circle ${
              currentPath === "/profil" ? "bg-blue-200" : ""
            }`}
          >
            <div className="indicator">
              <UserRound />
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
