Pour lancer les serveurs : 

Server front : 
    se placer dans le dossier front > npm run dev
    localhost:3000
Server back : 
    se placer dans le dossier back > npm start. 
    ==> Avec le Dockerfil du back fonctionnel, lancer le serveur via : docker-compose up --build
    localhost:5001
    (Lancer le Docker daemon, sinon cela ne fonctionne pas)

    Adminer : 
    localhost:8080

Lancer les deux serveurs sur deux terminaux différents

To start working:

The first time, copy .env.sample (in backend folder and to root) to .env and set the variables.

Then, to run the dev project, use:

  cd backend docker compose up --build
  cd frontend && npm run dev

You may run backend on localhost:5001
You may run frontend on localhost:3000
You may connect the PgSQL database (Adminer), when running on the 127.0.0.1:5432 host