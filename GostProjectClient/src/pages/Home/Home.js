// styles
import "./Home.css";
// libraries
import { useState, useEffect, useRef } from "react";
// components
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import HeaderUser from "../../components/Header/HeaderUser";
import GostsTable from "../../components/GostsTable/GostsTable";
import axios from "axios";

const Home = () => {
  // здесь же страница после поиска, кнопка назад просто будет появляться и будут изменяться данные в table

  return (
    <>
      {true ? <HeaderAdmin /> : <HeaderUser />}
      <div className="body_container">
        <GostsTable />
      </div>
    </>
  );
};

export default Home;
