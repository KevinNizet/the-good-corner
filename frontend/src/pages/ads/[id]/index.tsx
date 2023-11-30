/* eslint-disable react/no-unescaped-entities */
import { AdType } from "@/components/AdCard";
import { Layout } from "@/components/Layout";
import { queryAd } from "@/graphql/queryAd";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Ad(): React.ReactNode {
  const router = useRouter();
  const adId = router.query.id;

  const { data } = useQuery<{ item: AdType }>(queryAd, {
    variables: {
      id: adId,
    },
    skip: adId === undefined,
  });
  const ad = data ? data.item : null;

  return (
    <Layout title="Ad">
      <main className="main-content">
       
        {ad ? (
          <>
            <h2>{ad.title}</h2> <button className="ad-card-button" onClick={() => router.push(`/ads/${ad.id}/edit`)}>Modifier l'offre</button>
            <p>{ad.description}</p>
            <p>{ad.price} €</p>
            {ad.imgUrl && <img className="ad-card-image-detail" src={ad.imgUrl} alt="Image de l'annonce" />}
            
          </>
        ) : adId ? (
          "Chargement/erreur"
        ) : (
          "id absent de l'URL"
        )}
      </main>
    </Layout>
  );
}