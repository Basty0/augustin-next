"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, ReactNode } from "react";

interface VerieProps {
  children: ReactNode;
}

function getCookie(name: string): string | undefined {
  let value = `; ${document.cookie}`;
  let parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

const Verie: React.FC<VerieProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("userToken"); // Assurez-vous que le nom du cookie est correct
    if (token) {
      setIsAuthenticated(true);
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!isAuthenticated) {
    return null; // Ou un spinner de chargement si vous préférez
  }

  return <div>{children}</div>;
};

export default Verie;
