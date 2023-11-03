import { gql } from "@apollo/client";

//ajout de la variable where pour filtrer par catégories
//variable définie dans composant RecentAds.tsx

export const queryAllAds = gql`
  query ads($where: AdsWhere) {
    items: allAds(where: $where) {
      id
      title
      price
      imgUrl
      description
      category {
        id
      }
    }
  }
`;