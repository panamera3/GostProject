// styles
import "./Gost.css";
// libraries
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GostTable from "../../components/GostTable/GostTable";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import HeaderUser from "../../components/Header/HeaderUser";
import axios from "axios";
import { useParams } from 'react-router-dom';
// components

const Gost = (props) => {
  const params = useParams();
  const navigate = useNavigate();

  const deleteHandler = () => {
    axios({
      method: "delete",
      url: `https://localhost:7243/api/Gost/DeleteGost/${params.id}`,
      //headers: { Authorization: `Bearer ${userToken}` },
    })
      .then((data) => {
        console.log(data.status);
        if (data.status === 200) {
          navigate("/home");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const addFavGostHandler = () => {
    const userId = localStorage.getItem("id");
    axios({
      method: "post",
      responseType: "json",
      url: `https://localhost:7243/api/Gost/AddFavouriteGost/?userId=${userId}&gostId=${params.id}`,
    })
      .then((gost) => {
        console.log("gost.data favourite", gost.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {localStorage.getItem("role") == 2 ? <HeaderAdmin /> : <HeaderUser />}
      <div className="body_container">
        <div className="activities_container">
          <div>
            <a href="/home">Назад</a>
            <p onClick={() => addFavGostHandler()}>Добавить в избранное</p>
          </div>
          {true && (
            <div>
              <a href="/gostEdit">Редактировать</a>
              <p>Архивировать</p>
              <p onClick={deleteHandler}>Удалить</p>
            </div>
          )}
        </div>
        <GostTable view id={params.id} />
      </div>
    </>
  );
};

export default Gost;
