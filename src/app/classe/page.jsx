"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Verie from "@/components/Verie";
import Header from "@/components/Header";

const Home = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const fetchClasses = async () => {
    try {
      const token = getCookie("userToken");
      if (!token) {
        console.error("No token found");
        return;
      } else {
        console.log("Token found:", token);
      }
      const response = await axios.get(
        "https://lycee-augustin.mg/api/classes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Verie>
      <Header />
      <div className="container mx-auto py-6 px-3">
        <div className="card bg-base-100 shadow-xl">
          <figure>
            <Image
              className="rounded-t-lg"
              src="/images/image4.png"
              alt="Student"
              width={400}
              height={120}
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Classes</h2>
            <p>Voici la liste de vos classes</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mt-4">
          {classes.map((item, index) => (
            <div
              key={index}
              className="card bg-primary shadow-lg cursor-pointer"
              onClick={() => router.push(`/cour/${item.id}`)}
            >
              <div className="card-body bg-gray-50 border-2 border-green-900 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="bg-green-900 p-3 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="white"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 12v8m0-8V4m0 8H4m8 0h8"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">{item.nom}</h3>
                </div>
                <p>Matière: {item.nom}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Verie>
  );
};

export default Home;
