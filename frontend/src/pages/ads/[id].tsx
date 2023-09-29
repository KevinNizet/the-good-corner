import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AdCardProps } from "@/components/AdCard";
import axios from "axios";
import { API_URL } from "@/config";
import toast, { Toaster } from 'react-hot-toast';

export default function Ad() {
  const router = useRouter();
  const adId = router.query.id as string;
  const [adDetails, setAdDetails] = useState({} as AdCardProps);
  //détermine si l'utilisateur est en mode édition ou visualisation des détails de l'annonce
  //et permet donc de changer l'afichage JSX en fonction
  const [isEditing, setIsEditing] = useState(false);
  //stocke les champs de détails de l'annonce en cours d'édition par l'utilisateur.
  const [editedAdDetails, setEditedAdDetails] = useState({} as AdCardProps);

  //afficher les détails d'une annonce
  useEffect(() => {
    axios.get(`http://localhost:5001/ads/${adId}`).then((result) => {
      setAdDetails(result.data);
      setEditedAdDetails(result.data);
    }).catch((err) => {
      console.error(err);
    })
  }, [adId]);

  //supprimer une annonce
  async function deleteAd() {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cette annonce ?");
    if (confirmDelete) {
      try {
        await axios.delete(`${API_URL}/ads/${adId}`);
        toast.success('Annonce supprimée avec succès !', {
          icon: '✅',
        });
        // Rediriger vers la page d'accueil ou une autre page après suppression
        setTimeout(() => {
          router.push(`/`)
         }, 1800); 
      } catch (error) {
        console.error(error);
        toast.error('Une erreur est survenue lors de la suppression de l\'annonce.', {
          icon: '❌',
        });
      }
    }
  }

// MàJ d'une annonce
  function startEditing() {
    // Permet de passer en mode édition au clique sur le bouton modifier
    //et copier les détails actuels dans les champs à modifier
    setIsEditing(true);
    setEditedAdDetails(adDetails);
  }

  async function saveChanges() {
    try {
      await axios.patch(`${API_URL}/ads/${adId}`, editedAdDetails);
      toast.success('Annonce mise à jour avec succès !', {
        icon: '✅',
      });
      //màj des données après la requête patch
      setAdDetails(editedAdDetails)
      // Sortie du mode édition après la màj
      setIsEditing(false);

    } catch (error) {
      console.error(error);
      toast.error('Une erreur est survenue lors de la mise à jour de l\'annonce.', {
        icon: '❌',
      });
    }
  }

  return (
    <Layout title="Ad">
      <main className="main-content">
        <p>Offre ID: {adId}</p>
        {isEditing ? (
          <>
            <button onClick={saveChanges}>Enregistrer</button>
              
            <button onClick={() => setIsEditing(false)}>Annuler</button>
            <input
              type="text"
              name="title"
              value={editedAdDetails.title}
              onChange={(e) =>
                setEditedAdDetails({ ...editedAdDetails, title: e.target.value })
              }
            />
            <input
              type="number"
              name="price"
              value={editedAdDetails.price}
              onChange={(e) =>
                setEditedAdDetails({ ...editedAdDetails, price: e.target.value })
              }
            />
            <input
              type="text"
              name="description"
              value={editedAdDetails.description}
              onChange={(e) =>
                setEditedAdDetails({ ...editedAdDetails, description: e.target.value })
              }
            />
          </>
        ) : (
          <>
            <button onClick={deleteAd}>Supprimer l'annonce</button>
            <button onClick={startEditing}>Modifier</button>
            {adDetails && (
              <>
                <h2>{adDetails.title}</h2>
                <p>{adDetails.description}</p>
                <p>Prix : {adDetails.price} €</p>
                <img
                  src={adDetails.imgUrl}
                  alt={adDetails.title}
                  height={500}
                />
              </>
            )}
          </>
        )}
        <Toaster />
      </main>
    </Layout>
  );
}