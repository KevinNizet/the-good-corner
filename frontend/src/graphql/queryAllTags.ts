import { gql } from "@apollo/client";

export const queryAllTags = gql`
  query allTags {
    items: allTags {
      id
      name
      ads {
        id
      }
    }
  }
`;