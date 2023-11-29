// RecentAds.tsx
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { AdCard, AdType, AdCardProps } from "./AdCard";
import { queryAllAds } from "@/graphql/queryAllAds";

type RecentAdsProps = {
  categoryId?: number;
  searchWord?: string;
};

export function RecentAds(props: RecentAdsProps): React.ReactNode {
  const [totalPrice, setTotalPrice] = useState(0);

  // Ajout du prix de chaque annonce au total
  function addToTotal(price: number) {
    const newTotalPrice = price + totalPrice;
    setTotalPrice(newTotalPrice);
  }

  // Utilisation de la queryAllAds
  const { data, loading, refetch } = useQuery<{ items: AdType[] }>(queryAllAds, {
    variables: {
      where: {
        ...(props.categoryId ? { categoryIn: [props.categoryId] } : {}),
        // ...(props.searchWord ? { searchTitle: props.searchWord } : {}),
      },
    },
  });

  // Si data n'est pas défini, renvoi un tableau vide
  const ads = data ? data.items : [];

  return (
    <main className="main-content">
      <h2>Annonces récentes</h2>
      <p>Prix total des offres sélectionnées : {totalPrice}€</p>
      <section className="recent-ads">
        {loading === true && <p>Chargement des annonces</p>}
        {ads.map((item) => (
          <div key={item.id}>
            <AdCard
              id={item.id}
              title={item.title}
              price={item.price}
              imgUrl={item.imgUrl}
              link={`/ads/${item.id}`}
              description={item.description}
              category={item.category}
              addToTotal={addToTotal} // Passer la fonction addToTotal en tant que prop
            />
          </div>
        ))}
      </section>
    </main>
  );
}
