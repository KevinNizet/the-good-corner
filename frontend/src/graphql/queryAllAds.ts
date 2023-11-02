import { gql } from "@apollo/client";

export const queryAllAds = gql`
  query ads {
    items: allAds {
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