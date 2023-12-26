// styles
// libraries
import { useState, useEffect, useRef } from "react";
import HeaderAdmin from "../../../components/HeaderAdmin/HeaderAdmin";
import GostTable from "../../../components/GostTable/GostTable";
// components

const GostAdd = () => {
  // здесь будет страница с созданием госта

  return (
    <>
      <HeaderAdmin />
      <div className="body_container">
        <div>
          <a href="/home">Назад</a>
        </div>
        <GostTable add />
      </div>
    </>
  );
};

export default GostAdd;
