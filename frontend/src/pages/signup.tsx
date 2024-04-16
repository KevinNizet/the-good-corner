import { Layout } from "@/components/Layout";
import { mutationSignup } from "@/graphql/mutationSignup";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export default function Signup(): React.ReactNode {
  const [email, setEmail] = useState('toto@gmail.com');
  const [password, setPassword] = useState('supersecret');
  const router = useRouter();

  const [doSignup, { error }] = useMutation(mutationSignup);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const { data } = await doSignup({
        variables: {
          data: {
            email,
            password,
          },
        },
      });
      if (data.item) {
        //si aucune erreure, redirige l'utilisateur vers la page de connexion
        router.replace('/signin');
      }
    } catch {}
  }

  return (
    <Layout title="Signup">
      <main className="main-content">
        {error && <p>Le compte existe déjà, ou le mot de passe est trop faible</p>}
        <form onSubmit={onSubmit}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <button type="submit"> Enregistrement</button>
        </form>
      </main>
    </Layout>
  );
}
