// AdCard.tsx
import toast, { Toaster } from 'react-hot-toast';
import { gql, useMutation } from "@apollo/client";
import { queryAllAds } from "../graphql/queryAllAds";
import { CategoryProps } from "./Category";
import { FiFileText } from "react-icons/fi";
import { IoPricetagsOutline } from "react-icons/io5";


export type AdType = {
  id: number;
  link: string;
  imgUrl: string;
  title: string;
  price: number;
  description: string;
  category: CategoryProps | null;
};

// Query graphQl
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
  addToTotal?: (price: number) => void; // Nouvelle prop pour la fonction addToTotal
};

export function AdCard(props: AdCardProps): JSX.Element {
  const [doDelete] = useMutation(mutationDeleteAd, {
    refetchQueries: [queryAllAds],
  });

  async function deleteAd() {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cette annonce ?");
    if (confirmDelete) {
      try {
        await doDelete({
          variables: {
            id: props.id,
          },
        });
        toast.success('Annonce supprimée avec succès! ✅');
        if (props.onDelete) {
          props.onDelete();
        }
      } catch (error) {
        toast.error("Une erreur est survenue lors de la suppression de l'annonce. 🙈");
        console.error("Erreur lors de la suppression de l'annonce :", error);
      }
    }
  }

  function addToTotal() {
    if (props.addToTotal) {
      props.addToTotal(props.price);
    }
  }

  return (
    <div className="ad-card-container">
      <a className="ad-card-link" href={props.link}>
        <img className="ad-card-image" src={props.imgUrl} alt={props.title} />
        <div className="ad-card-text">
          <div className="ad-card-title"><FiFileText />  {props.title}</div>
          <div className="ad-card-price"> <IoPricetagsOutline /> {props.price} €</div>
        </div>
        <div className="ad-card-description"> {props.description}</div>
        
      </a>
      <div className='ad-card-button-div'>
      <button className="ad-card-button" onClick={addToTotal}>Ajouter le prix au total</button>
      <button className="ad-card-button" onClick={deleteAd}>Supprimer</button>
      </div>
    </div>
  );
}
