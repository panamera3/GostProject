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
  // здесь будет страница с таблицей гостов

  // здесь же страница после поиска, кнопка назад просто будет появляться и будут изменяться данные в table
  const example = () => {
    axios({
      method: "get",
      url: `https://localhost:7243/api/Gost/GetGosts`,
      //headers: { Authorization: `Bearer ${userToken}` },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <HeaderAdmin />
      <HeaderUser />
      <GostsTable />
      <button onClick={() => example()}>Get all gosts</button>
    </>
  );
};

export default Home;
