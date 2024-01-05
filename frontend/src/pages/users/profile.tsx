import { Layout } from "@/components/Layout";
/* eslint-disable react/no-unescaped-entities */
import { useQuery } from "@apollo/client";
import { queryMySelf } from "@/graphql/queryMySelf";
import { UserType } from "@/types";

export default function Profile(): React.ReactNode {
  //récupération des infos de l'utilisateur connecté
  const { data: meData } = useQuery<{ item: UserType | null }>(queryMySelf);
  //si erreur à la récupération du profile, pas de profile, sinon, on récupère les infos
  const me = meData?.item;
  console.log(me);

  //Refacto: 
  //Logique de protection des pages délocalisée dans _app.tsx

  /* //Proctection pour afficher la page de profile quand l'utilisateur est connecté
  
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
    const me = data.item
    return (
      <Layout title="Mon profile">
        <main className="main-content">
          <p>Page de profile</p>
          <p>Mon adresse est : {me.email}</p>
        </main>
      </Layout>
    );
} */
return (
  <Layout title="Mon profile">
    <main className="main-content">
      <p>Page de profile</p>
      <p>Mon adresse est : {me?.email}</p>
    </main>
  </Layout>
);
}