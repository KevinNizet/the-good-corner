/* eslint-disable react/no-unescaped-entities */
import { AdType } from "@/components/AdCard";
import { CategoryType } from "@/components/Category";
import { Layout } from "@/components/Layout";
import { mutationCreateAd } from "@/graphql/mutationCreateAd";
import { mutationUpdateAd } from "@/graphql/mutationUpdateAd";
import { queryAd } from "@/graphql/queryAd";
import { queryAllCategories } from "@/graphql/queryAllCategories";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { queryAllAds } from "@/graphql/queryAllAds";
import { queryAllTags } from "@/graphql/queryAllTags";
import { FaPenToSquare } from "react-icons/fa6";


type AdFormData = {
  title: string;
  description: string;
  imgUrl: string;
  price: number;
  category: { id: number };
};

type AdFormProps = {
  ad?: AdType;
};

type TagType = {
  name: string;
  id: number;
}

export default function AdForm(props: AdFormProps) {
  const [error, setError] = useState<"title" | "price" | "category">();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState<number>(0); // Valeur par défaut non nulle
  const [tagId, setTagId] = useState<number>(0);
  const {
    data: categoriesData,
  } = useQuery<{ items: CategoryType[] }>(queryAllCategories);
  const categories = categoriesData ? categoriesData.items : [];

  const router = useRouter();

  const [doCreate, { loading: createLoading }] = useMutation(mutationCreateAd, {
    refetchQueries: [queryAllAds],
  });
  const [doUpdate, { loading: updateLoading }] = useMutation(mutationUpdateAd, {
    refetchQueries: [queryAd, queryAllAds],
  });
  const loading = createLoading || updateLoading;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    if (categoryId === 0) {
      setError("category");
    } else {
      const data: AdFormData = {
        title,
        description,
        imgUrl,
        price,
        category: { id: categoryId },
      };

      if (data.title.trim().length < 3) {
        setError("title");
      } else if (data.price < 0) {
        setError("price");
      } else {
        // Soumettre la requête avec les données validées
        if (!props.ad) {
          const result = await doCreate({
            variables: {
              data: data,
            },
          });
          if ("id" in result.data?.item) {
            router.replace(`/ads/${result.data.item.id}`);
          }
        } else {
          const result = await doUpdate({
            variables: {
              id: props.ad?.id,
              data: data,
            },
          });
          if (!result.errors?.length) {
            router.replace(`/ads/${props.ad.id}`);
          }
        }
      }
    }
  }

  useEffect(() => {
    if (props.ad) {
      setTitle(props.ad.title);
      setDescription(props.ad.description);
      setPrice(props.ad.price);
      setImgUrl(props.ad.imgUrl);
      setCategoryId(props.ad.category ? props.ad.category.id : 0); // Mettre la valeur de la catégorie ou 0 si null
    }
  }, [props.ad]);



  const { data: tagsData } = useQuery<{ items: TagType[] }>(queryAllTags);
  const tags = tagsData ? tagsData.items : [];

  return (
    <Layout title="Nouvelle offre">
      <main className="main-content">
        <h2 className="adform-modification-title"> <FaPenToSquare /> {props.ad ? "Modifier l'offre" : "Nouvelle offre"}</h2>
        {error === "price" && <p>Le prix doit être positif</p>}
        {error === "title" && (
          <p>Le titre est requis et doit faire plus de 3 caractères</p>
        )}
        {error === "category" && <p>Veuillez sélectionner une catégorie</p>}
        <form onSubmit={onSubmit}>
          <input
          className="adform-input"
            type="text"
            name="title"
            placeholder="Titre de l'annonce"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <br />
          <textarea
          className="adform-input"
            name="description"
            placeholder="Description de l'annonce"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <br />
          <br />
          <input
          className="adform-input"
            type="text"
            name="imgUrl"
            placeholder="Lien de l'image"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
          />
          <br />
          <br />
          <input
          className="adform-input"
            type="number"
            name="price"
            placeholder="0,00€"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <br />
          <br />
          <select
          className="adform-input"
            name="categoryId"
            value={categoryId + ""}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            <option value="0">Sélectionnez une catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <br />
          <br />
          <select
          className="adform-input"
            name="tagId"
            value={tagId + ""}
            onChange={(e) => setTagId(Number(e.target.value))}
          >
            <option value="0">Sélectionnez un tag</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
          <br />
          <br />
          <button className="ad-card-button" type="submit" disabled={loading}>
            {props.ad ? "Modifier" : "Poster l'annonce"}
          </button>
        </form>
      </main>
    </Layout>
  );
}