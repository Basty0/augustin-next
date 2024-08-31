import CoursListPage from "./CoursListPage";
import axios from "axios";

export async function generateStaticParams() {
  const response = await axios.get("http://127.0.0.1:8000/api/classes/all");
  const classes = response.data;

  return classes.map((classe) => ({
    slug: classe.id.toString(),
  }));
}

export default async function Page({ params }) {
  return <CoursListPage params={params} />;
}
