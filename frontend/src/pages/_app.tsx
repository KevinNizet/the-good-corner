import { queryMySelf } from "@/graphql/queryMySelf";
import "@/styles/globals.css";
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, useQuery } from "@apollo/client";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";

const link = createHttpLink({
  uri: "http://localhost:5001/",
  credentials: "include",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

//pages accessibles publiquement (sans connexion)

const publicPages = ["/", "/signin", "/signup", "/ads/[id]"];

// Composant parent Auth gérant l'affichage selon que l'utilisateur est connecté ou non

function Auth(props: { children: React.ReactNode }) {
  //UseQuery ne fonctionne que si  le composant est un enfant de ApolloProvider
  const { data, loading, error } = useQuery(queryMySelf);
  const router = useRouter();

  useEffect(() => {
    console.log("Navigating, new path =>", router.pathname);
    if (publicPages.includes(router.pathname) === false) {
      console.log("Seems to be a private page");
      //redirection si non connecté
      if (error) {
        console.log("Not connected, redirecting");
        router.replace("/signin");
      }
    }
  }, [router, error]);

  if (loading) {
    return <p>Chargement</p>;
  }

  return props.children;
} 

function App({ Component, pageProps }: AppProps) {
  return (
    //UseQuery ne fonctionne que si  le composant est un enfant de ApolloProvider
    <ApolloProvider client={client}>
       <Auth> 
        <Component {...pageProps} />
       </Auth> 
    </ApolloProvider>
  );
}

// Disabling SSR
export default dynamic(() => Promise.resolve(App), { ssr: false });