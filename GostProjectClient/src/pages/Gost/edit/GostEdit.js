// styles
// libraries
import { useState, useEffect, useRef } from "react";
import HeaderAdmin from "../../../components/HeaderAdmin/HeaderAdmin";
import GostTable from "../../../components/GostTable/GostTable";
// components

const GostEdit = () => {
  // здесь будет страница с редактированием таблицы информации госта, просто в элемент передавать true на edit

  return (
    <>
      <HeaderAdmin />
      <div className="body_container">
        <div className="activities_container">
          <div>
            <a href="/home">Назад</a>
          </div>
        </div>
        <GostTable edit />
      </div>
    </>
  );
};

export default GostEdit;
