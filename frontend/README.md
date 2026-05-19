# RewardHub Frontend

React frontend for the gamified crowdsourcing reward module.

## Run

Make sure the Spring Boot backend is running on `http://localhost:8080`, then start the frontend:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:5173`.

The frontend uses `/api` requests through the Vite proxy configured in `vite.config.js`. Mock data is kept in `src/data/mockData.js` and is used only when an endpoint is unavailable.
