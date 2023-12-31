import { useEffect, useState } from "react";
import { AdCard, AdCardProps } from "./AdCard";
import axios from "axios";
import { API_URL } from "@/config";

export function RecentAds(): React.ReactNode {
  const [ads, setAds] = useState([] as AdCardProps[]);
  const [totalPrice, setTotalPrice] = useState(0);

  function addToTotal(price: number) {
    const newTotalPrice = price + totalPrice;
    setTotalPrice(newTotalPrice);
  }

  async function fetchAds() {
    const result = await axios.get(API_URL + "/ads");
    setAds(result.data);
  }

  //requête au serveur back pour récupérer les Ads
  useEffect(() => {
    // mounting
    axios.get("http://localhost:5001/ads").then((result) => {
      setAds(result.data)
    }).catch((err) => {
      console.error(err);
    })
    
  }, []);

  return (
    <main className="main-content">
      <h2>Annonces récentes</h2>
      <p>Prix total des offres sélectionnées : {totalPrice}€</p>
      <section className="recent-ads">
        {ads.map((item) => (
          <div key={item.id}>
            <AdCard
              id={item.id}
              title={item.title}
              price={item.price}
              imgUrl={item.imgUrl}
              link={`/ads/${item.id}`}
              //permet d'éxécuter la fonction fetchAds au moment du Delete
              //depuis l'enfant AdCard
              onDelete={fetchAds}
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
