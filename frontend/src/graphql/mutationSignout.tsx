import { gql } from "@apollo/client";

export const mutationSignout = gql `
mutation singout{
    signout
  }
  `;