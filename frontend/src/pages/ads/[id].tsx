import { Layout } from "@/components/Layout";
/* import { ads } from "@/components/RecentAds"; */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AdCardProps } from "@/components/AdCard";
import axios from "axios";

export default function Ad() {
  const router = useRouter();
  const adId = router.query.id as string;
  const [adDetails, setAdDetails] = useState({} as AdCardProps);

  useEffect(() => {
    axios.get(`http://localhost:5001/ads/${adId}`).then((result) => {
      setAdDetails(result.data);
    }).catch((err) => {
      console.error(err);
    })
  }, [adId]);

  return (
    <Layout title="Ad">
      <main className="main-content">
        <p>Offre ID: {adId}</p>
        {adDetails && (
          <>
            <h2>{adDetails.title}</h2>
            <p>Prix : {adDetails.price} €</p>
            <p>Image : <img src={adDetails.imgUrl} alt={adDetails.title} /></p>
          </>
        )}
      </main>
    </Layout>
  );
}
