import "./Home.css";
import { useState, useEffect, useRef } from "react";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import HeaderUser from "../../components/Header/HeaderUser";
import GostsTable from "../../components/GostsTable/GostsTable";

const Home = ({searchGosts, favourites, archiveGosts}) => {
  return (
    <>
      {localStorage.getItem("role") == "Admin" ? (
        <HeaderAdmin />
      ) : (
        <HeaderUser />
      )}
      <div className="body_container">
        {searchGosts && (
          <div className="activities_container">
            <a href="/search">Назад</a>
          </div>
        )}
        {favourites && (
          <div className="activities_container">
            <a href="/home">Назад</a>
          </div>
        )}
        <GostsTable
          favourites={favourites}
          searchGosts={searchGosts}
          archiveGosts={archiveGosts}
        />
      </div>
    </>
  );
};

export default Home;
