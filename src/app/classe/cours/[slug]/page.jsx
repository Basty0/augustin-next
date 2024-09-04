"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import { ArrowLeft, BadgePlus, FilePlus2, Minimize2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Verie from "@/components/Verie";

const CoursListPage = ({ params }) => {
  const [cours, setCours] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCours, setNewCours] = useState({
    chapitre: "",
    titre_d: "",
    titre_f: "",
    heure_d: "",
    heure_f: "",
    date: "",
  });
  const router = useRouter();

  const [enseId, setEnseId] = useState(0);

  useEffect(() => {
    fetchCours();
  }, [params.slug]);

  function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  }
  const fetchCours = async () => {
    try {
      const token = getCookie("userToken");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        `https://lycee-augustin.mg/api/enseignement/${params.slug}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setCours(response.data || []);
    } catch (error) {
      console.error("Error fetching cours:", error);
      setCours([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCours = async () => {
    try {
      const token = getCookie("userToken");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        `https://lycee-augustin.mg/api/enseignements/${enseId}/cours`,
        { ...newCours, enseignement_id: enseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Résultat obtenu:", response.data);
      if (response.status === 201) {
        setLoading(true);
        fetchCours();
        setModalVisible(false);
        setNewCours({
          chapitre: "",
          titre_d: "",
          titre_f: "",
          heure_d: "",
          heure_f: "",
          date: "",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error("Validation error:", error.response.data);
        alert("Erreur de validation: Veuillez vérifier les données saisies.");
      } else {
        console.error("Error adding cours:", error);
        alert("Erreur: Impossible d'ajouter le cours. Veuillez réessayer.");
      }
    }
  };

  const openModal = (enseignementId) => {
    setEnseId(enseignementId);
    document.getElementById("add_course_modal").showModal();
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
      <div className="container mx-auto px-4 ">
        <button
          onClick={() => router.back()}
          className="absolute top-1 left-1 z-10 bg-green-300 p-2 rounded-full"
        >
          <ArrowLeft className="text-black" size={24} />
        </button>

        <div className="py-4 mt-6">
          <div className="bg-green-200 md:flex rounded-lg mb-4  md:p-3">
            <Image
              src="/images/image4.png"
              alt="Élève"
              width={500}
              height={200}
              className="w-full md:w-[40%] h-40 md:h-60 md:rounded-lg  rounded-t-lg mb-4 md:mb-0 object-cover"
            />
            <div className="p-6 ">
              <h2 className="text-2xl font-bold text-green-900">Les cours</h2>
              <p className="text-gray-600 mt-2">
                Découvrez tous les cours disponibles pour votre classe
              </p>
            </div>
          </div>

          {cours.map((enseignement) => (
            <div key={enseignement.id} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">
                  {enseignement.matiere && enseignement.matiere.nom}
                  <span className="bg-green-100 p-1 rounded-full ml-2">
                    {enseignement.cours.length}
                  </span>
                </h3>
                <button
                  className="btn bg-green-900 text-white rounded-full"
                  onClick={() => openModal(enseignement.id)}
                >
                  <FilePlus2 size={20} />
                  <span>Nouvelle</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <div
                  className="flex gap-2 pb-2"
                  style={{ width: "max-content" }}
                >
                  {enseignement.cours &&
                    enseignement.cours.map((item) => (
                      <Card
                        key={item.id}
                        className="w-60 flex-shrink-0 border border-green-900 rounded-lg"
                      >
                        <Card.Body>
                          <Card.Title>{item.titre_d}</Card.Title>
                          <Card.Text>
                            {item.chapitre}
                            <br />
                            {item.heure_d} - {item.heure_f}
                            <br />
                            {new Date(item.created_at).toLocaleDateString()}
                          </Card.Text>
                          <Button
                            variant="primary"
                            onClick={() => router.push(`/cour-info/${item.id}`)}
                          >
                            Voir détails
                          </Button>
                        </Card.Body>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <dialog id="add_course_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Ajouter un cours</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddCours();
              }}
            >
              <h1>{enseId}</h1>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Chapitre</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={newCours.chapitre}
                  onChange={(e) =>
                    setNewCours({ ...newCours, chapitre: e.target.value })
                  }
                />
              </div>

              {/* New fields */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Titre (début)</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={newCours.titre_d}
                  onChange={(e) =>
                    setNewCours({ ...newCours, titre_d: e.target.value })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Titre (fin)</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={newCours.titre_f}
                  onChange={(e) =>
                    setNewCours({ ...newCours, titre_f: e.target.value })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Heure de début</span>
                </label>
                <input
                  type="time"
                  className="input input-bordered"
                  value={newCours.heure_d}
                  onChange={(e) =>
                    setNewCours({ ...newCours, heure_d: e.target.value })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Heure de fin</span>
                </label>
                <input
                  type="time"
                  className="input input-bordered"
                  value={newCours.heure_f}
                  onChange={(e) =>
                    setNewCours({ ...newCours, heure_f: e.target.value })
                  }
                />
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Ajouter
                </button>
                <form method="dialog">
                  <button className="btn">Fermer</button>
                </form>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </Verie>
  );
};

export default CoursListPage;
