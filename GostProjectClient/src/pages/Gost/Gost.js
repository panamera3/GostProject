// styles
import "./Gost.css";
// libraries
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GostTable from "../../components/GostTable/GostTable";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import HeaderUser from "../../components/Header/HeaderUser";
import axios from "axios";
// components

const Gost = (props) => {
  const navigate = useNavigate();

  const deleteHandler = () => {
    axios({
      method: "delete",
      url: `https://localhost:7243/api/Gost/DeleteGost/12`,
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

  return (
    <>
      {true ? <HeaderAdmin /> : <HeaderUser />}
      <div className="body_container">
        <div className="activities_container">
          <div>
            <a href="/home">Назад</a>
            <p>Добавить в избранное</p>
          </div>
          {true && (
            <div>
              <a href="/gostEdit">Редактировать</a>
              <p>Архивировать</p>
              <p onClick={deleteHandler}>Удалить</p>
            </div>
          )}
        </div>
        <GostTable view id={props.id} />
      </div>
    </>
  );
};

export default Gost;
