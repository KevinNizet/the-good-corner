/* eslint-disable react/no-unescaped-entities */
import AdForm from "../../components/AdForm";
import { Layout } from "@/components/Layout";


export default function NewAd() {

//Refacto : 
//Logique de protection ci-dessous délocalisée dans _app.tsx avec le composant parent Auth
//permettant de l'appeller sur toutes les routes protégées

/*   //Proctection pour permettre publication seulement si utilisateur connecté
  const { data, loading, error } = useQuery(queryMySelf);
  const router = useRouter();

  if(loading) {
    return <p>En cours de chargement</p>
  }

  //si non connecté, renvoi vers la page de signin
  if (error) {
    router.replace("/signin")
    return <></>;
  }

  //item est un alias pour queryMySelf
  //si l'utilsateur est connecté, on retourne le formulaire
  if (data.item) {
    return (
      <Layout title="Nouvelle offre">
        <main className="main-content">
          <AdForm />
        </main>
      </Layout>
    );
  } */

  return (
    <Layout title="Nouvelle offre">
      <main className="main-content">
        <AdForm />
      </main>
    </Layout>
  );
}
