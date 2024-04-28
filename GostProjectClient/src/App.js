// libraries
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
// styles
import "./App.css";
// pages
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import Home from "./pages/Home/Home";
import UserProfiles from "./pages/Admin/UserProfiles/UserProfiles";
import GostAdd from "./pages/Gost/add/GostAdd";
import GostEdit from "./pages/Gost/edit/GostEdit";
import Gost from "./pages/Gost/Gost";
import FavouritesGosts from "./pages/FavouritesGosts/FavouritesGosts";
import SearchGosts from "./pages/Search/Search";
import { ToastContainer } from "react-toastify";
import MyProfile from "./pages/MyProfile/MyProfile";
import ArchiveGosts from "./pages/Admin/Archive/Archive";
import Activity from "./pages/Admin/Activity/Activity";
import CompanyRegistration from "./pages/private/CompanyRegistration/CompanyRegistration";


function App() {
  useEffect(() => {
    const header = document.querySelector(".header");
    if (header) {
      const headerHeight = header.offsetHeight;
      const bodyContainer = document.querySelector(".body_container");
      if (bodyContainer) {
        bodyContainer.style.paddingTop = `${1.3 * headerHeight}px`;
      }
    }
  }, []);

  return (
    <>
      <div className="body">
      <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/home" element={<Home />} />
            <Route path="/userProfiles" element={<UserProfiles />} />
            <Route path="/gostAdd" element={<GostAdd />} />
            <Route path="/gostEdit/:id" element={<GostEdit />} />
            <Route path="/gost/:id" element={<Gost />} />
            <Route path="/userProfiles" element={<UserProfiles />} />
            <Route path="/favourites" element={<FavouritesGosts />} />
            <Route path="/search" element={<SearchGosts />} />
            <Route path="/myProfile" element={<MyProfile />} />
            <Route path="/archive" element={<ArchiveGosts />} />
            <Route path="/activity" element={<Activity />} />

            сделать "скрытыми" эти пути
            <Route path="/companyRegistration" element={<CompanyRegistration />} />

            перенаправлять пользователя на главную страницу, если ввёл
            несуществующий путь
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
