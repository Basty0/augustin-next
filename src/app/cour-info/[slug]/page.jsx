"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookMarked,
  Calendar,
  Clock1,
  FilePenLine,
  LibraryBig,
} from "lucide-react";
import Image from "next/image";
import Header from "@/components/Header";
import Verie from "@/components/Verie";

export default function CoursInfo({ params }) {
  const router = useRouter();
  const [cours, setCours] = useState({});
  const [presences, setPresences] = useState([]);
  const [presents, setPresents] = useState([]);
  const [absents, setAbsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedCours, setUpdatedCours] = useState({
    user_id: "",
    chapitre: "",
    titre_d: "",
    titre_f: "",
    heure_d: "",
    heure_f: "",
  });
  function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  }
  const fetchData = useCallback(async () => {
    try {
      const token = getCookie("userToken");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/api/cour/presence/cours/${params.slug}/eleves`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log(data);
      setCours(data.cour || {});
      setPresences(data.presences || []);
      setPresents(data.present || []);
      setAbsents(data.absent || []);
      setUpdatedCours({
        user_id: data.cour.user_id,
        chapitre: data.cour.chapitre,
        titre_d: data.cour.titre_d,
        titre_f: data.cour.titre_f,
        heure_d: data.cour.heure_d,
        heure_f: data.cour.heure_f,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchData();
  }, [params.slug]);

  const updateCours = async () => {
    try {
      const token = getCookie("userToken");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.put(
        `http://127.0.0.1:8000/api/cour/update/${params.slug}`,
        updatedCours,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        console.log("Cours updated successfully");
        setLoading(true);
        fetchData();
        setModalVisible(false);
      }
    } catch (error) {
      console.error(
        "Error updating cours:",
        error.response ? error.response.data : error.message
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const ListeAbsents = ({ absents }) => {
    return (
      <div className="p-4 bg-red-50 rounded-lg border-2 border-red-600">
        <h3 className="text-xl font-bold mb-2">Absents</h3>
        {absents.map((absent) => (
          <div
            key={absent.id}
            className="bg-red-600 p-2 mb-2 rounded-md shadow text-white"
          >
            <p className="font-semibold">
              {absent.eleve.nom} {absent.eleve.prenom}
            </p>
            <p>{absent.status}</p>
          </div>
        ))}
      </div>
    );
  };

  const ListePresents = ({ presents }) => {
    return (
      <div className="p-4 bg-green-50 rounded-lg border-2 border-green-600">
        <h3 className="text-xl font-bold mb-2">Présents</h3>
        {presents.map((present) => (
          <div
            key={present.id}
            className="bg-green-600 p-2 mb-2 rounded-md shadow text-white"
          >
            <p className="font-semibold">
              {present.eleve.nom} {present.eleve.prenom}
            </p>
            <p>{present.status}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Verie className="">
      <Header />

      <div className="container mx-auto p-4 mt-14">
        <button
          onClick={() => router.back()}
          className="btn btn-circle btn-outline absolute top-4 left-4"
        >
          <ArrowLeft />
        </button>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Cours</h2>
            <div className="flex items-center mb-2">
              <LibraryBig className="text-green-500 mr-2" size={36} />
              <span className="text-lg">{cours.titre_d}</span>
            </div>
            <div className="flex items-center mb-2">
              <BookMarked className="mr-2" size={18} />
              <span>{cours.chapitre}</span>
            </div>
            <div className="flex items-center mb-2">
              <Clock1 className="mr-2" size={18} />
              <span>
                {cours.heure_d} - {cours.heure_f}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2" size={18} />
              <span>
                {new Date(cours.created_at).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mb-6">
          <button
            className="btn btn-outline btn-primary"
            onClick={() => {
              setLoading(true);
              router.push(`/presences/${cours.id}`);
            }}
            onClick={() => router.push(`/presences/${cours.id}`)}
          >
            Présences
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setModalVisible(true)}
          >
            <FilePenLine size={25} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ListeAbsents absents={absents} />
          <ListePresents presents={presents} />
        </div>

        {modalVisible && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Modifier le cours</h3>
              <input
                type="text"
                placeholder="Chapitre"
                className="input input-bordered w-full mb-4"
                value={updatedCours.chapitre}
                onChange={(e) =>
                  setUpdatedCours({ ...updatedCours, chapitre: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Titre début"
                className="input input-bordered w-full mb-4"
                value={updatedCours.titre_d}
                onChange={(e) =>
                  setUpdatedCours({ ...updatedCours, titre_d: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Titre fin"
                className="input input-bordered w-full mb-4"
                value={updatedCours.titre_f}
                onChange={(e) =>
                  setUpdatedCours({ ...updatedCours, titre_f: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Heure début"
                className="input input-bordered w-full mb-4"
                value={updatedCours.heure_d}
                onChange={(e) =>
                  setUpdatedCours({ ...updatedCours, heure_d: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Heure fin"
                className="input input-bordered w-full mb-4"
                value={updatedCours.heure_f}
                onChange={(e) =>
                  setUpdatedCours({ ...updatedCours, heure_f: e.target.value })
                }
              />
              <div className="modal-action">
                <button className="btn" onClick={() => setModalVisible(false)}>
                  Annuler
                </button>
                <button className="btn btn-primary" onClick={updateCours}>
                  Mettre à jour
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Verie>
  );
}
