import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Delete from "./components/auth/delete/deleteuser.jsx"
import ConfirmDelete from "./components/auth/delete/deleteconfirm.jsx"

import About from "./components/about"
import Header from "./components/header";
import Home from "./components/home";
import Profile from "./components/profile/profile.jsx";

import MakeCategory from "./components/user_content/make_category.jsx";

import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Home />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/make_category",
      element: <MakeCategory />
    },
    {
      path: "/delete",
      element: <ConfirmDelete />,
    },
    {
      path: "/confirm/final/completed/delete",
      element: <Delete />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <Header />
      <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
