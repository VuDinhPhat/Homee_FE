import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Main from "./components/Main";
import Students from "./components/Students/Students";
import LoginPage from "./Pages/Login/LoginPage";
import Statistics from "./Pages/Statistics/Statistics";
import Team from "./components/Team/Team";
import Schools from "./components/Schools/Schools";
import Rounds from "./components/Rounds/Rounds";
import Results from "./components/Results/Results";
import Contestants from "./components/Contestants/Contestants";
import Competitions from "./components/Competitions/Competitions";
import Coachs from "./components/Coachs/Coachs";
import Cars from "./components/Cars/Cars";
import Brackets from "./components/Brackets/Brackets";
import RegisterPage from "./Pages/Register/RegisPage";
import Footer from "./Pages/Footer/Footer";
import Detail from "./Pages/Detail/Detail";
import Payment from "./Pages/Payment/Payment";
import UserMainPage from "./Pages/UserMain/UserMainPage";
import "bootstrap/dist/css/bootstrap.min.css";
import Profile from "./Pages/Profile/Profile";
import Order from "./Pages/Order/Order";
import ChefMain from "./Pages/ChefMain/ChefMain";
import ProfileChef from "./Pages/ProfileChef/ProfileChef";
import OrderChef from "./Pages/OrderChef/OrderChef";
import TopUp from "./Pages/TopUp/TopUp";
import TopUpChef from "./Pages/TopUp/TopUpChef";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/footer",
    element: <Footer />,
  },
  {
    path: "/detail",
    element: <Detail />,
  },
  {
    path: "/payment",
    element: <Payment />,
  },
  {
    path: "/topup",
    element: <TopUp />,
  },

  {
    path: "/usermain",
    element: <UserMainPage />,
  },
  {
    path: "/chefmain",
    element: <ChefMain />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/profilechef",
    element: <ProfileChef />,
  },
  {
    path: "/order",
    element: <Order />,
  },
  {
    path: "/orderchef",
    element: <OrderChef />,
  },

  {
    path: "/topupchef",
    element: <TopUpChef />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Main />,
      },

      {
        path: "/statistics",
        element: <Statistics />,
      },
      {
        path: "/students",
        element: <Students />,
      },
      {
        path: "/team",
        element: <Team />,
      },
      {
        path: "/schools",
        element: <Schools />,
      },
      {
        path: "/rounds",
        element: <Rounds />,
      },
      {
        path: "/results",
        element: <Results />,
      },
      {
        path: "/contestants",
        element: <Contestants />,
      },
      {
        path: "/competitions",
        element: <Competitions />,
      },
      {
        path: "/coachs",
        element: <Coachs />,
      },
      {
        path: "/cars",
        element: <Cars />,
      },
      {
        path: "/brackets",
        element: <Brackets />,
      },
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
