"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
import Verie from "@/components/Verie";
import PresenceNavButton from "@/components/PresenceHeader";

export default function Presences({ params }) {
  const router = useRouter();
  const coursId = params.id;
  const [presences, setPresences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchAllPresences();
    }
  }, [params.id]);

  function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  }

  const fetchAllPresences = async () => {
    try {
      const token = getCookie("userToken");
      if (!token) {
        console.error("No token found");
        return;
      }

      const courResponse = await axios.get(
        `https://lycee-augustin.mg/api/cour/courspresence/${params.id}/eleves`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const classeResponse = await axios.get(
        `https://lycee-augustin.mg/api/cour/presence/${params.id}/eleves`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (courResponse.data.length > 0) {
        setPresences(courResponse.data);
      } else {
        setPresences(classeResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEleveStatus = (eleve_id) => {
    setPresences(
      presences.map((student) => {
        if (student.eleve_id === eleve_id) {
          return {
            ...student,
            status: student.status === "present" ? "absent" : "present",
          };
        }
        return student;
      })
    );
  };

  const enregistrerPresences = async () => {
    setIsSaving(true);
    try {
      const response = await axios.put(
        `https://lycee-augustin.mg/api/cour/presence/${coursId}`,
        {
          presences: presences.map((p) => ({
            eleve_id: p.eleve_id,
            status: p.status,
          })),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Présences enregistrées avec succès:", response.data);
      router.back();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des présences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <Verie className="">
      <Header />
      <PresenceNavButton slug={coursId} />
      <div className="container mx-auto mt-16 p-4">
        <h2 className="text-2xl font-bold mb-4">Liste des élèves</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {presences.map((student) => (
            <div
              key={student.eleve_id}
              className={`card ${
                student.status === "present" ? "bg-green-500" : "bg-white"
              } shadow-xl cursor-pointer transition-colors duration-300`}
              onClick={() => toggleEleveStatus(student.eleve_id)}
            >
              <div className="card-body">
                <h2 className="card-title">
                  {student.id} {student.nom} {student.prenom}
                </h2>
                <p>{student.status === "present" ? "Présent" : "Absent"}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-5 mt-8">
          <button
            className="btn btn-primary"
            onClick={enregistrerPresences}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Enregistrement...
              </>
            ) : (
              "Enregistrer"
            )}
          </button>
          <button className="btn btn-secondary" onClick={() => router.back()}>
            Annuler
          </button>
        </div>
      </div>
    </Verie>
  );
}
