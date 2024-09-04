"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ScanLine } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import Header from "@/components/Header";
import Verie from "@/components/Verie";

export default function Presence({ params }) {
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const router = useRouter();
  const coursId = params.id; // Remplacez ceci par la logique appropriée pour obtenir le coursId
  const [presences, setPresences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(0);
  const scannerRef = useRef(null);

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
        `http://127.0.0.1:8000/api/cour/courspresence/${params.id}/eleves`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const classeResponse = await axios.get(
        `http://127.0.0.1:8000/api/cour/presence/${params.id}/eleves`,
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
    const eleveExists = presences.some(
      (student) => student.eleve_id === parseInt(eleve_id)
    );

    if (eleveExists) {
      const updatedData = presences.map((student) => {
        if (student.eleve_id === parseInt(eleve_id)) {
          return {
            ...student,
            status: "present",
          };
        }
        return student;
      });
      setPresences(updatedData);
      setNotif(1);
    } else {
      setNotif(2);
    }
  };

  const enregistrerPresences = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/cour/presence/${coursId}`,
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

  const handleBarCodeScanned = (data) => {
    setScanned(true);
    updateEleveStatus(data);
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

  const startScanner = () => {
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleBarCodeScanned(decodedText);
          html5QrCode.stop();
          setScanning(false);
        },
        (error) => {
          console.error("QR code scanning error:", error);
        }
      )
      .catch((err) => {
        console.error("Failed to start scanner:", err);
      });

    scannerRef.current = html5QrCode;
    setScanning(true);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          setScanning(false);
        })
        .catch((err) => {
          console.error("Failed to stop scanner:", err);
        });
    }
  };

  const renderScanner = () => {
    return (
      <div className="w-full aspect-square">
        <div id="reader" className="w-full h-full"></div>
      </div>
    );
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
      <div className="flex flex-col items-center mt-16 p-4">
        {!scanned && renderScanner()}

        <div className="w-full mt-4">
          <Notification />
        </div>

        <div className="w-full bg-white p-5 items-center mt-4">
          <p className="text-base mb-10 text-center">
            {scanned
              ? "Code QR scanné. Scannez à nouveau ou terminez."
              : "Scannez un code QR pour enregistrer la présence."}
          </p>

          <button
            className={`bg-green-900 border border-green-900 px-5 py-3 rounded-xl w-60 flex justify-center items-center mx-auto ${
              scanning ? "opacity-50" : ""
            }`}
            onClick={scanning ? stopScanner : startScanner}
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
