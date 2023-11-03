import { useQuery } from "@apollo/client";
import { useState } from "react";
import { AdCard, AdType } from "./AdCard";
import { queryAllAds } from "@/graphql/queryAllAds";

type RecentAdsProps = {
  categoryId?: number;
  searchWord?: string;
};

export function RecentAds(props: RecentAdsProps): React.ReactNode {
  const [totalPrice, setTotalPrice] = useState(0);

  //ajout du prix de chaque annonce au total
  function addToTotal(price: number) {
    const newTotalPrice = price + totalPrice;
    setTotalPrice(newTotalPrice);
  }

  //utilisation de la queryAllAds 
  const { data, loading, refetch} = useQuery<{ items: AdType[] }>(queryAllAds, {
    variables: {
      where: {
        ...(props.categoryId ? { categoryIn: [props.categoryId] } : {}),

        //todo logique pour la recherche d'annonce via searchBar
        /* ...(props.searchWord ? { searchTitle: props.searchWord } : {}), */
      },
    },
  });
  // si data n'est pas défini, renvoi un tableau vide
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
            />
            <button
              onClick={() => {
                addToTotal(item.price);
              }}
            >
              Ajouter {item.price}€ au total
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}
