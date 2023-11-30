// RecentAds.tsx
import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { AdCard, AdType, AdCardProps } from "./AdCard";
import { queryAllAds } from "@/graphql/queryAllAds";

type RecentAdsProps = {
  categoryId?: number;
  searchWord?: string;
};

export function RecentAds(props: RecentAdsProps): React.ReactNode {
  const [totalPrice, setTotalPrice] = useState(0);
  //pagination
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);
  // Ajout du prix de chaque annonce au total
  function addToTotal(price: number) {
    const newTotalPrice = price + totalPrice;
    setTotalPrice(newTotalPrice);
  }

  // Utilisation de la queryAllAds
  const { data, loading } = useQuery<{ items: AdType[]; count: number }>(queryAllAds,{
    variables: {
      where: {
        ...(props.categoryId ? { categoryIn: [props.categoryId] } : {}),
        // ...(props.searchWord ? { searchTitle: props.searchWord } : {}),
      },
      skip: page * pageSize,
      take: pageSize,
    },
  });

  // Si data n'est pas défini, renvoi un tableau vide
  const ads = data ? data.items : [];

  const count = data ? data.count : 0;
  const pagesCount = Math.ceil(count / pageSize);

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
      <p>Nombre de résultats par page ?</p>
      <button onClick={() => setPageSize(5)}>5</button>
      <button onClick={() => setPageSize(10)}>10</button>
      <button onClick={() => setPageSize(20)}>20</button>
      <br />
      <br />
      <p>
        Page actuelle : {page} ; nombre total d'éléments : {count}
      </p>
      <button
        disabled={page === 0}
        onClick={() => setPage(Math.max(page - 1, 0))}
      >
        Précédent
      </button>
      <button
        disabled={page === pagesCount - 1}
        onClick={() => setPage(Math.min(page + 1, pagesCount))}
      >
        Suivant
      </button>
      <br />
      <br />
    </main>
  );
}
