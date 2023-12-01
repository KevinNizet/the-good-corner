// RecentAds.tsx
import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { AdCard, AdType, AdCardProps } from "./AdCard";
import { queryAllAds } from "@/graphql/queryAllAds";
import { queryAllTags } from "@/graphql/queryAllTags";
import { Tags, TagsProps } from "./Tags";
import Link from "next/link";
import { MdOutlineTag } from "react-icons/md";
import { IoPricetagsOutline } from "react-icons/io5";
import { LuFilter } from "react-icons/lu";
import { SlBasket } from "react-icons/sl";




type RecentAdsProps = {
  categoryId?: number;
  searchWord?: string;
  tagId?: number;
};

export function RecentAds(props: RecentAdsProps): React.ReactNode {
  //pagination
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);

  // Ajout du prix de chaque annonce au total
  const [totalPrice, setTotalPrice] = useState(0);
  function addToTotal(price: number) {
    const newTotalPrice = price + totalPrice;
    setTotalPrice(newTotalPrice);
  }


  // Utilisation de la queryAllTags
  const { data: tagsData, loading: tagsLoading, error: tagsError } = useQuery<{ items: TagsProps[] }>(
    queryAllTags
  );
  const tags = tagsData ? tagsData.items : [];

  if(tagsError) {
    console.error("graphQl error:", tagsError);
  }

  // Utilisation de la queryAllAds
  const { data, loading, error } = useQuery<{ items: AdType[]; count: number }>(queryAllAds,{
    variables: {
      where: {
        // filtre par catégories
        ...(props.categoryId ? { categoryIn: [props.categoryId] } : {}),
        // filtre par tags
        ...(props.tagId ? { tagIn: [props.tagId] } : {}),
        // ...(props.searchWord ? { searchTitle: props.searchWord } : {}),
      },
      skip: page * pageSize,
      take: pageSize,
    },
  });

  if(error) {
    console.error("graphQl error:", error);
  }


  // Si data n'est pas défini, renvoi un tableau vide
  const ads = data ? data.items : [];

  //pagination
  const count = data ? data.count : 0;
  const pagesCount = Math.ceil(count / pageSize);

  //nombre d'ads pour le cas où une ad est présente sur la page
  const adsCount = ads.length;

  // Utilisation de la queryAllTags


  return (
    <main className="main-content">
      <h2>Annonces récentes</h2>
      {/* gestion des tags */}
        <div className="global-div">
      <nav>
        {tagsLoading === true && <p>Chargement des tags...</p>}
        
        <div> <LuFilter className={"icons"} />
        
          Afficher les offres par tags :</div>
        <div className="all-tags">
        <MdOutlineTag className={"icons"} />
        {tags?.map((tag, index) => (
          <React.Fragment key={tag.id}>
            <Tags
              name={tag.name}
              id={tag.id}
            /> 
            {index < tags.length - 1 && " • "}
          </React.Fragment>
        ))}
        </div>
      </nav>
      <div className="vertical-bar"></div>
      <div>
      <div ><IoPricetagsOutline className={"icons"}/> Prix total des offres sélectionnées :</div>
      <div className="total-price"><SlBasket className={"icons"}/>
          {totalPrice} €</div>
      </div>
      </div>
      
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
      className={`ad-card-button ${ads.length < 5 || page === 0 ? 'disabled-button' : ''}`}
      disabled={ads.length < 5 || page === 0}
      onClick={() => setPage(Math.max(page - 1, 0))}
      > Précédent
      </button>
      <button
      className={`ad-card-button ${ads.length < 5 || page === pagesCount - 1 ? 'disabled-button' : ''}`}
        disabled={ads.length < 5 || page === pagesCount - 1}
        onClick={() => setPage(Math.min(page + 1, pagesCount))}
      >
        Suivant
      </button>
      </div>
    </main>
  );
}
