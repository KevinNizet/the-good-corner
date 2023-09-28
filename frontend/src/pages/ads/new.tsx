/* eslint-disable react/no-unescaped-entities */
import { CategoryType } from "@/components/Category";
import { Layout } from "@/components/Layout";
import { API_URL } from "@/config";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import Router from "next/router";


type AdFormData = {
  title: string;
  description: string;
  price: number;
  category: { id: number };
};

export default function NewAd() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [hasBeenSent, setHasBeenSent] =useState(false);

  //State pour gérer les champs du formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState<null | number>(null);


  async function fetchCategories() {
    const result = await axios.get<CategoryType[]>(`${API_URL}/categories`);
    setCategories(result.data);
  }

  useEffect(() => {
    // mounting
    fetchCategories();
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(
      formData.entries()
    ) as unknown as AdFormData;

    //transformation de categoryId pour pouvoir l'exploiter
    if ("categoryId" in data) {
      data.category = { id: Number(data.categoryId) };
      delete data.categoryId;
    }

    //POST des données du formulaires
    axios.post('http://localhost:5001/ads', data)
    .then(response => {
      console.log("données envoyées à la BDD", data);
      if ("id" in response.data) {
        setTitle("");
        setDescription("");
        setPrice(0);
        setImgUrl("");
        setCategoryId(null);
        setHasBeenSent(true);
       setTimeout(() => {
        Router.push(`/`)
       }, 3000); 
      }
    })
    .catch(error => {
      console.error("erreur lors de l'envoi", error);
    });
}


return (
  <Layout title="Nouvelle offre">
    <main className="main-content">
      {hasBeenSent ? (
        <>
        <p>Votre annonce a bien été postée 🙂🎊  ! </p>
        <p>Vous allez être redirigé sur la page des annonces</p>
        </>
      ) : (
        <>
          <p>Poster une nouvelle offre</p>
          <form onSubmit={onSubmit}>
            <input type="text" name="title" placeholder="Titre de l'annonce" value={title} onChange={(e) => setTitle(e.target.value)} />
            <br />
            <br />
            <input
              type="text"
              name="description"
              placeholder="Description de l'annonce"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <br />
            <br />
            <input type="number" name="price" placeholder="0,00€" value={price} onChange={(e) => setPrice(Number(e.target.value))}/>
            <br />
            <br />
            <input type="text" name="imgUrl" placeholder="Lien de l'image" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)}/>
            <br />
            <br />
            <select name="categoryId" value={categoryId + ""} onChange={(e) => setCategoryId(Number(e.target.value))}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <br />
            <br />
            <button type="submit">Poster l'annonce</button>
          </form>
        </>
      )}
    </main>
  </Layout>
);
}