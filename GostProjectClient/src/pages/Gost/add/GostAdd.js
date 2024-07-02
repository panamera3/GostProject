import { useState, useEffect, useRef } from "react";
import HeaderAdmin from "../../../components/HeaderAdmin/HeaderAdmin";
import GostTable from "../../../components/GostTable/GostTable";

const GostAdd = () => {
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
