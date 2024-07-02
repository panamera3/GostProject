import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import HeaderAdmin from "../../../components/HeaderAdmin/HeaderAdmin";
import GostTable from "../../../components/GostTable/GostTable";

const GostEdit = () => {  
  const params = useParams();

  return (
    <>
      <HeaderAdmin />
      <div className="body_container">
        <div className="activities_container">
          <div>
            <a href="/home">Назад</a>
          </div>
        </div>
        <GostTable edit id={params.id} />
      </div>
    </>
  );
};

export default GostEdit;
