import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import HeaderAdmin from "../../../components/HeaderAdmin/HeaderAdmin";
import GostTable from "../../../components/GostTable/GostTable";
import { BodyContainer } from "../../../components/styles/styled_components";

const GostEdit = () => {
  const params = useParams();

  return (
    <>
      <HeaderAdmin />
      <BodyContainer>
        <div className="activities_container">
          <div>
            <a href="/home">Назад</a>
          </div>
          <div>
            <p>Редактирование ГОСТа</p>
          </div>
        </div>
        <GostTable edit id={params.id} />
      </BodyContainer>
    </>
  );
};

export default GostEdit;
