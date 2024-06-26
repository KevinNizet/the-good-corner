import { Layout } from "@/components/Layout";
import { mutationSignin } from "@/graphql/mutationSignin";
import { queryMySelf } from "@/graphql/queryMySelf";

import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export default function Signup(): React.ReactNode {
  const [email, setEmail] = useState('toto@gmail.com');
  const [password, setPassword] = useState('supersecret');
  const [failed, setFailed] =useState(false);
  const router = useRouter();

  const [doSignin, { error }] = useMutation(mutationSignin, {
    //refetch de la query essentiel pour remettre à jour le composant parent Auth (dans _app.tsx)
    refetchQueries: [queryMySelf]
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFailed(false);
    try {
      const { data } = await doSignin({
        variables: {
            email,
            password,
        },
      });
      if (data.item) {
        //si aucune erreure, redirige l'utilisateur vers le dashboard
        router.replace('/');
      } else {
        //si la connexion a echoué
        setFailed(true);
      }
    } catch {}
  }

  return (
    <Layout title="Connexion">
      <main className="main-content">
        {error && (<p>Une erreure est survenue</p>)} 
        {failed && (<p>Identifiants incorrects</p>)}
        <form onSubmit={onSubmit}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <button type="submit"> Connexion</button>
        </form>
      </main>
    </Layout>
  );
}
