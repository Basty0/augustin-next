"use client";

import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Assurez-vous que ce contexte est configuré pour Next.js
import axios from "axios";
import React from "react";
import {
  BellIcon,
  ChevronLeftIcon,
  HelpCircle,
  Info,
  Lock,
  UserIcon,
} from "lucide-react";
import Verie from "@/components/Verie";
import Header from "@/components/Header";
import { get } from "http";

const SettingItem = ({ icon, title, description, toggle }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-200">
    <div className="flex items-center">
      {icon}
      <div className="ml-3">
        <p className="text-base font-semibold">{title}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </div>
    {toggle}
  </div>
);

function getCookie(name) {
  let value = `; ${document.cookie}`;
  let parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
export default function Profil() {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getCookie("userToken");
        console.log(token);
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/auth",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    document.cookie =
      "userToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login"); // Redirige vers la page de connexion
  };
  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <Verie>
      <Header />
      <div className="flex flex-col bg-white mt-0">
        <div className="bg-gray-100 p-4">
          <button
            className="mb-4"
            onClick={() => router.back()} // Remplacez TouchableOpacity par un simple bouton
          >
            <ChevronLeftIcon className="h-6 w-6 text-black" />
          </button>
          <div className="flex flex-col items-center">
            <Image
              src={
                userData.photo
                  ? `https://lycee-augustin.mg/user/images/${userData.photo}`
                  : "https://lycee-augustin.mg/user/images/profilob.jpg"
              }
              alt="Profile Picture"
              width={96}
              height={96}
              className="rounded-full"
            />
            <p className="mt-2 text-xl font-bold">{`${userData.name} ${userData.prenom}`}</p>
            <p className="text-gray-500">{userData.email}</p>
          </div>
        </div>

        <div className="p-4 rounded-t-2xl">
          <p className="text-lg font-bold mb-4">Paramètres</p>

          <SettingItem
            icon={<BellIcon className="h-6 w-6 text-black" />}
            title="Notifications"
            description="Activé"
          />
          <SettingItem
            icon={<Lock className="h-6 w-6 text-black" />}
            title="Confidentialité"
          />
          <SettingItem
            icon={<UserIcon className="h-6 w-6 text-black" />}
            title="Compte"
          />
          <SettingItem
            icon={<HelpCircle className="h-6 w-6 text-black" />}
            title="Aide"
          />
          <SettingItem
            icon={<Info className="h-6 w-6 text-black" />}
            title="À propos"
          />
        </div>

        <button
          className="m-4 bg-red-500 py-3 rounded-lg text-center"
          onClick={handleLogout}
        >
          <p className="text-white font-semibold">Se déconnecter</p>
        </button>
      </div>
    </Verie>
  );
}
