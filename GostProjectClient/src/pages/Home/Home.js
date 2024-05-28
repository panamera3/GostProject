// styles
import "./Home.css";
// libraries
import { useState, useEffect, useRef } from "react";
// components
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import HeaderUser from "../../components/Header/HeaderUser";
import GostsTable from "../../components/GostsTable/GostsTable";

const Home = (props) => {
  return (
    <>
      {localStorage.getItem("role") == "Admin" ? (
        <HeaderAdmin />
      ) : (
        <HeaderUser />
      )}
      <div className="body_container">
        {props.searchGosts && (
          <div className="activities_container">
            <a href="/search">Назад</a>
          </div>
        )}
        {props.favourites && (
          <div className="activities_container">
            <a href="/home">Назад</a>
          </div>
        )}
        <GostsTable
          favourites={props.favourites}
          searchGosts={props.searchGosts}
          archiveGosts={props.archiveGosts}
        />
      </div>
    </>
  );
};

export default Home;
