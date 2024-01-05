import { Layout } from "@/components/Layout";


/* eslint-disable react/no-unescaped-entities */
import { useQuery } from "@apollo/client";
import { queryMySelf } from "@/graphql/queryMySelf";
import { useRouter } from "next/router";

export default function Profile(): React.ReactNode {

  //Proctection pour afficher la page de profile quand l'utilisateur est connecté
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
    const me = data.item
    return (
      <Layout title="Mon profile">
        <main className="main-content">
          <p>Page de profile</p>
          <p>Mon adresse est : {me.email}</p>
        </main>
      </Layout>
    );
}
}