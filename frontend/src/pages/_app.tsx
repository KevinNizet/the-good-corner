import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, useQuery } from "@apollo/client";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { UserType } from "@/types";
import { queryMySelf } from "@/graphql/queryMySelf";
import "@/styles/globals.css";

const link = createHttpLink({
  uri: "http://localhost:5001/",
  credentials: "include",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

// Pages accessibles publiquement (sans connexion)
const publicPages = ["/", "/signin", "/signup", "/ads/[id]"];

// Composant parent Auth gérant l'affichage selon que l'utilisateur est connecté ou non
function Auth(props: { children: React.ReactNode }) {
  // UseQuery ne fonctionne que si le composant est un enfant de ApolloProvider
  const { data, loading } = useQuery<{ item: UserType | null }>(queryMySelf);
  const router = useRouter();

  useEffect(() => {

    console.log("Navigating, new path =>", router.pathname);
    // Redirection si la page n'est pas publique et que l'utilisateur n'est pas connecté

    //conditions loading nécessaire. Permet d'attendre que la requêtes HTTP au serveur soit reçue
    //avant de vérifier la connexion
    //puis de vérifier si la page est publique ou non

    if (!loading && !data?.item && !publicPages.includes(router.pathname)) {
      console.log("Not connected, redirecting");
      router.replace("/signin");
    }
  }, [router, data, loading]);

  if (loading) {
    return <p>Chargement</p>;
  }

  return props.children;
}

function App({ Component, pageProps }: AppProps) {
  return (
    // UseQuery ne fonctionne que si le composant est un enfant de ApolloProvider
    <ApolloProvider client={client}>
      <Auth>
        <Component {...pageProps} />
      </Auth>
    </ApolloProvider>
  );
}

// Disabling SSR
export default dynamic(() => Promise.resolve(App), { ssr: false });
