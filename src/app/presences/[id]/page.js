"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ScanLine } from "lucide-react";
import { QrReader } from "react-qr-reader";
import Header from "@/components/Header";
import Verie from "@/components/Verie";
import PresenceNavButton from "@/components/PresenceHeader";

export default function Presences({ params }) {
  const [scanning, setScanning] = useState(false);
  const router = useRouter();
  const coursId = params.id;
  const [presences, setPresences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(0);

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
        console.log(courResponse.data);
        setPresences(courResponse.data);
      } else {
        setPresences(classeResponse.data);
        console.log(classeResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateEleveStatus = (eleve_id) => {
    setPresences((prevPresences) => {
      // Vérifie si l'élève existe dans la liste des présences
      const eleveExists = prevPresences.some(
        (student) => student.eleve_id === parseInt(eleve_id)
      );

      if (eleveExists) {
        // Met à jour seulement l'élève scanné sans modifier les autres
        const updatedData = prevPresences.map((student) => {
          if (
            student.eleve_id === parseInt(eleve_id) &&
            student.status !== "present"
          ) {
            return {
              ...student,
              status: "present", // Marque l'élève comme présent
            };
          }
          return student; // Garde l'état des autres élèves inchangé
        });
        setNotif(1); // Notification de succès
        return updatedData; // Retourne la nouvelle liste de présences
      } else {
        setNotif(2); // Notification d'échec si l'élève n'est pas trouvé
        return prevPresences; // Ne modifie pas la liste des présences
      }
    });
  };

  const enregistrerPresences = async () => {
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
    }
  };

  const handleScan = (result) => {
    if (result) {
      console.log(result.text);
      updateEleveStatus(result.text);
      setTimeout(() => setNotif(0), 2000);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const Notification = () => {
    if (notif === 1) {
      return (
        <div className="bg-green-300 p-4 rounded-xl">
          <p className="text-center">Présence enregistrée avec succès ✅</p>
        </div>
      );
    } else if (notif === 2) {
      return (
        <div className="bg-red-300 p-4 rounded-xl">
          <p className="text-center">L'élève n'est pas dans cette classe ❌</p>
        </div>
      );
    } else {
      return null;
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
      <PresenceNavButton slug={params.id} />
      <div className="flex flex-col items-center mt-16 p-4">
        {scanning && (
          <div className="w-full max-w-sm">
            <QrReader
              delay={300}
              onError={handleError}
              onResult={handleScan}
              style={{ width: "100%" }}
              constraints={{ facingMode: "environment" }}
            />
          </div>
        )}

        <div className="w-full mt-4">
          <Notification />
        </div>

        <div className="w-full bg-white p-5 items-center mt-4">
          <p className="text-base mb-10 text-center">
            {scanning
              ? "Scannez un code QR pour enregistrer la présence."
              : "Cliquez sur Scanner pour commencer."}
          </p>

          <button
            className={`bg-green-900 border border-green-900 px-5 py-3 rounded-xl w-60 flex justify-center items-center mx-auto ${
              scanning ? "opacity-50" : ""
            }`}
            onClick={() => setScanning(!scanning)}
          >
            <ScanLine color="white" size={24} />
            <span className="text-white text-base font-bold ml-2">
              {scanning ? "Arrêter le scan" : "Scanner"}
            </span>
          </button>

          <div className="flex justify-center space-x-5 mt-4">
            <button
              className="bg-green-700 p-3 rounded-lg text-white font-bold"
              onClick={enregistrerPresences}
            >
              Terminer
            </button>
            <button
              className="bg-red-700 p-3 rounded-lg text-white font-bold"
              onClick={() => router.back()}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </Verie>
  );
}
