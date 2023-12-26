// styles
import "./Gost.css";
// libraries
import { useState, useEffect, useRef } from "react";
import GostTable from "../../components/GostTable/GostTable";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import HeaderUser from "../../components/Header/HeaderUser";
// components

const Gost = () => {
  // здесь будет страница с таблицей информацией по госту

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
              <p>Удалить</p>
            </div>
          )}
        </div>
        <GostTable view />
      </div>
    </>
  );
};

export default Gost;
