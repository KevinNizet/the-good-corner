import { useQuery } from "@apollo/client";
import { useState } from "react";
import { AdCard, AdType } from "./AdCard";
import { queryAllAds } from "@/graphql/queryAllAds";


export function RecentAds(): React.ReactNode {
  const [totalPrice, setTotalPrice] = useState(0);

  function addToTotal(price: number) {
    const newTotalPrice = price + totalPrice;
    setTotalPrice(newTotalPrice);
  }

  //utilisation de la queryAllAds 
  const { data, loading,} = useQuery<{ items: AdType[] }>(queryAllAds);
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
              //permet d'éxécuter la fonction fetchAds au moment du Delete
              //depuis l'enfant AdCard
              /* onDelete={fetchAds} */
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
