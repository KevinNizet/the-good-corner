// RecentAds.tsx
import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { AdCard, AdType, AdCardProps } from "./AdCard";
import { queryAllAds } from "@/graphql/queryAllAds";
import { queryAllTags } from "@/graphql/queryAllTags";

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

  //pagination
  const count = data ? data.count : 0;
  const pagesCount = Math.ceil(count / pageSize);

  //nombre d'ads pour le cas où une ad est présente sur la page
  const adsCount = ads.length;

  // Utilisation de la queryAllTags
  const { data: tagsData, loading: tagsLoading } = useQuery(queryAllTags); 

  return (
    <main className="main-content">
      <h2>Annonces récentes</h2>
      <p>Prix total des offres sélectionnées : {totalPrice}€</p>
      {/* si une seul carte d'Ad est présente sur le carte, on modifie la grille définie dans le CSS
      permet d'avoir une taille de carte non déformée */}
      <section className={`recent-ads ${adsCount === 1 ? 'single-card' : ''}`}>
        
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
              addToTotal={addToTotal} // Passe la fonction addToTotal en tant que prop
              tag={tagsData ? tagsData.items.find((tag: { ads: any[]; })  => tag.ads.some((ad: { id: number; }) => ad.id === item.id)) : null}
            />
          </div>
        ))}
      </section>
      <div className="div-pagination1"> 
      <p>Nombre de résultats par page </p>
      <button className="ad-card-button" onClick={() => setPageSize(5)}>5</button>
      <button className="ad-card-button" onClick={() => setPageSize(10)}>10</button>
      <button className="ad-card-button" onClick={() => setPageSize(20)}>20</button>
 
      </div>
      <div className="div-pagination2"> 
      <p>
        Page actuelle : {page} | Nombre total d'annonces : {count}
       
      </p>
      
      </div>
      <div className="div-pagination3"> 
      <button
      className={`ad-card-button ${page === 0 ? 'disabled-button' : ''}`}
      disabled={page === 0}
      onClick={() => setPage(Math.max(page - 1, 0))}
      > Précédent
      </button>
      <button
      className={`ad-card-button ${page === pagesCount - 1 ? 'disabled-button' : ''}`}
        disabled={page === pagesCount - 1}
        onClick={() => setPage(Math.min(page + 1, pagesCount))}
      >
        Suivant
      </button>
      </div>
    </main>
  );
}
