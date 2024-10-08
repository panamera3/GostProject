import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
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
import { GlobalStyle } from "./components/styles/styled_components";

function App() {
  useEffect(() => {
    const userId = localStorage.getItem("id");
    const workCompanyID = localStorage.getItem("workCompanyID");
    const refreshToken = localStorage.getItem("refreshToken");

    if (userId && workCompanyID) {
      const controller = new AbortController();
      const signal = controller.signal;
      let reloadTimeout;

      const reloadAfterError = () => {
        reloadTimeout = setTimeout(() => {
          window.location.reload();
        }, 10000);
      };

      const fetchData = async () => {
        try {
          await axios.post(
            "/api/Auth/CheckUserAndCompany",
            {
              userId: userId,
              companyId: workCompanyID,
            },
            { signal }
          );
        } catch (error) {
          handleFetchError(error);
        }
      };

      const refreshAccessToken = async () => {
        try {
          const response = await fetch("/api/Auth/RefreshToken", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              UserID: localStorage.getItem("id"),
              RefreshToken: refreshToken,
            }),
          });

          if (!response.ok) {
            handleTokenRefreshError();
          } else {
            const data = await response.json();
            localStorage.setItem("refreshToken", data.refreshToken);
          }
        } catch (error) {
          console.error(error);
        }
      };

      const handleFetchError = (error) => {
        if (error.response) {
          if (error.response.status === 404 || error.response.status === 400) {
            localStorage.clear();
            document.cookie = "token=;";
            toast.error(
              "Пользователь или компания не найдены. Будет произведён выход из аккаунта."
            );
            reloadAfterError();
          } else if (error.response.status === 401) {
            window.location.reload();
          } else if (error.response.status.toString().startsWith("5")) {
            toast.error(
              "Произошла ошибка на сервере. Пожалуйста, попробуйте позже."
            );
          } else if (error.response.status.toString().startsWith("4")) {
            toast.error(
              "Произошла ошибка на клиенте. Пожалуйста, попробуйте позже."
            );
          } else {
            window.location.reload();
          }
        }
      };

      const handleTokenRefreshError = () => {
        localStorage.clear();
        document.cookie = "token=;";
        toast.error(
          "Что-то пошло не так. Будет произведён выход из аккаунта, просьба перезайти в аккаунт заново."
        );
        reloadAfterError();
      };

      fetchData();
      refreshAccessToken();

      return () => {
        controller.abort();
        clearTimeout(reloadTimeout);
      };
    }
  }, []);

  return (
    <>
      <GlobalStyle />
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
            <Route path="/notification/:id" element={<AcceptNotification />} />
            <Route path="/search" element={<Search />} />
          </Route>

          <Route
            path="/companyRegistration"
            element={<CompanyRegistration />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
