import { API_URL } from "@/config";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

export type AdType = {
  id: number;
  link: string;
  imgUrl: string;
  title: string;
  price: number;
};

export type AdCardProps = AdType & {
  onDelete?: () => void;
};

export function AdCard(props: AdCardProps): React.ReactNode {
  async function deleteAd() {
    //pop-up de confirmation de suppression
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cette annonce ?");
    toast('Annonce supprimée avec succés !', {
      icon: '✅',
    });
    if (confirmDelete) {
      await axios.delete(`${API_URL}/ads/${props.id}`);
      if (props.onDelete) {
        props.onDelete();
      }
    }
  }



  return (
    
    <div className="ad-card-container">
      <a className="ad-card-link" href={props.link}>
        <img className="ad-card-image" src={props.imgUrl} />
        <div className="ad-card-text">
          <div className="ad-card-title">{props.title}</div>
          <div className="ad-card-price">{props.price} €</div>
        </div>
      </a>
      {props.onDelete && <button onClick={deleteAd}>Supprimer</button>}
      <Toaster />
    </div>
  );
}