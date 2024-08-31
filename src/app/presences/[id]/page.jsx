import Presences from "./Presences";
import axios from "axios";

export async function generateStaticParams() {
  const response = await axios.get("http://127.0.0.1:8000/api/cours/all");
  const cours = response.data;

  return cours.map((cours) => ({
    id: cours.id.toString(),
  }));
}

export default async function Page({ params }) {
  return <Presences params={params} />;
}
