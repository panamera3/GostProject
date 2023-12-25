// styles
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
      <div className="activities_container">
        <div>
          <a href="/">Назад</a>
          <p>Добавить в избранное</p>
        </div>
        <div>
          <a href="/gostEdit">Редактировать</a>
          <p>Архивировать</p>
          <p>Удалить</p>
        </div>
      </div>
      <GostTable />
    </>
  );
};

export default Gost;
