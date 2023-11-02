import { API_URL } from "@/config";
import toast, { Toaster } from 'react-hot-toast';
import { gql, useMutation } from "@apollo/client";
import { queryAllAds } from "./RecentAds";
import { CategoryProps } from "./Category";

export type AdType = {
  id: number;
  link: string;
  imgUrl: string;
  title: string;
  price: number;
  description: string;
  category: CategoryProps | null;
};

//Query graphQl
const mutationDeleteAd = gql`
  mutation deleteAd($id: ID!) {
    deleteAd(id: $id) {
      id
      title
    }
  }
`;

export type AdCardProps = AdType & {
  onDelete?: () => void;
};

// Déclaration de la fonction deleteAd en dehors du composant
async function deleteAd(doDelete: any, id: number, onDelete: any) {
  const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cette annonce ?");
  if (confirmDelete) {
    try {
      // Tentative de suppression de l'annonce
      await doDelete({
        variables: {
          id: id,
        },
      });

      toast.success('Annonce supprimée avec succès !');

      // Appel de onDelete après la suppression réussie
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      // Gestion des erreurs
      toast.error('Une erreur est survenue lors de la suppression de l\'annonce.');
      console.error("Erreur lors de la suppression de l'annonce :", error);
    }
  }
}

export function AdCard(props: AdCardProps): JSX.Element {
  const [doDelete] = useMutation(mutationDeleteAd, {
    //màj des ads une fois la suppression faite en refetchant
    refetchQueries: [queryAllAds],
  });

  // Appel de la fonction deleteAd en passant les paramètres nécessaires
  const handleDelete = () => {
    deleteAd(doDelete, props.id, props.onDelete);
  };

  return (
    <div className="ad-card-container">
      <a className="ad-card-link" href={props.link}>
        <img className="ad-card-image" src={props.imgUrl} alt={props.title} />
        <div className="ad-card-text">
          <div className="ad-card-title">{props.title}</div>
          <div className="ad-card-price">{props.price} €</div>
        </div>
      </a>
      <button onClick={handleDelete}>Supprimer</button> 
    </div>
  );
}
