To start working:

The first time, copy .env.sample (in backend folder and to root) to .env and set the variables.

Then, to run the dev project, use:

**Backend:**
```
  cd backend docker compose up --build
```

**Frontend:**
``` 
  cd frontend && npm run dev
```

You may run backend on localhost:5001
You may run frontend on localhost:3000
You may connect the PgSQL database (Adminer), when running on the 127.0.0.1:5432 host