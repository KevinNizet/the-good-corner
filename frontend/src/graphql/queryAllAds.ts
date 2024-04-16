import { gql } from "@apollo/client";

//ajout de la variable where pour filtrer par catégories
//variable définie dans composant RecentAds.tsx

export const queryAllAds = gql`
  query AllAds($skip: Int, $take: Int, $where: AdsWhere) {
    items: allAds(skip: $skip, take: $take, where: $where) {
      id
      title
      price
      imgUrl
      description
      category {
        id
      }
      tags {
        id
      }
    }
    count: allAdsCount(where: $where)
  }
`;