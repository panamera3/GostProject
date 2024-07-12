import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import Home from "./pages/Home/Home";
import UserProfiles from "./pages/Admin/UserProfiles/UserProfiles";
import GostAdd from "./pages/Gost/add/GostAdd";
import GostEdit from "./pages/Gost/edit/GostEdit";
import Gost from "./pages/Gost/Gost";
import FavouritesGosts from "./pages/FavouritesGosts/FavouritesGosts";
import SearchGosts from "./pages/SearchGosts/SearchGosts";
import { toast, ToastContainer } from "react-toastify";
import MyProfile from "./pages/MyProfile/MyProfile";
import ArchiveGosts from "./pages/Admin/Archive/Archive";
import Activity from "./pages/Admin/Activity/Activity";
import CompanyRegistration from "./pages/private/CompanyRegistration/CompanyRegistration";
import EditUserProfile from "./pages/Admin/UserProfiles/Edit/EditUserProfile";
import Notifications from "./pages/Notifications/Notifications";
import AcceptNotification from "./pages/Notifications/Accept/AcceptNotification";
import Search from "./pages/Search/Search";
import NotConfirmed from "./pages/NotConfirmed/NotConfirmed";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import axios from "axios";

function App() {
  useEffect(() => {
    if (localStorage.getItem("id") && localStorage.getItem("workCompanyID")) {
      const reloadAfterError = () => {
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
      const fetchData = async () => {
        axios({
          method: "post",
          url: '/api/Auth/CheckUserAndCompany',
          data: {
            userId: localStorage.getItem("id"),
            companyId: localStorage.getItem("workCompanyID")
          },
        })
          .catch((error) => {
            if (error.response.status === 404) {
              localStorage.clear();
              toast.error("Пользователь или компания не найдены. Будет произведён выход из аккаунта.");
              reloadAfterError();
            }
            if (error.response.status === 500) {
              toast.error("Произошла ошибка на сервере. Пожалуйста, попробуйте позже.");
              reloadAfterError();
            }
            if (error.response.status === 400) {
              localStorage.clear();
              toast.error("Что-то пошло не так. Будет произведён выход из аккаунта.");
              reloadAfterError();
            }
          });
      };

      fetchData();
    }
  }, []);

  return (
    <>
      <div className="body">
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<NotConfirmed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />

            <Route path="/" element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/userProfiles" element={<UserProfiles />} />
              <Route path="/editUser/:id" element={<EditUserProfile />} />
              <Route path="/gostAdd" element={<GostAdd />} />
              <Route path="/gostEdit/:id" element={<GostEdit />} />
              <Route path="/gost/:id" element={<Gost />} />
              <Route path="/favourites" element={<FavouritesGosts />} />
              <Route path="/afterSearch" element={<SearchGosts />} />
              <Route path="/myProfile" element={<MyProfile />} />
              <Route path="/archive" element={<ArchiveGosts />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route
                path="/notification/:id"
                element={<AcceptNotification />}
              />
              <Route path="/search" element={<Search />} />
            </Route>

            {/*
            <Route path="/" element={<NotConfirmed />} />
            */}

            <Route
              path="/companyRegistration"
              element={<CompanyRegistration />}
            />
            {/* перенаправлять пользователя на главную страницу, если ввёл несуществующий путь */}

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
