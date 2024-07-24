import React from "react";
import { BlackA } from "../styles/styled_components";

const BackLink = () => {
  const handleBack = (event) => {
    event.preventDefault(); // Предотвращаем переход по ссылке
    window.history.back(); // Возвращаем на предыдущую страницу
  };

  return (
    <BlackA href="#" onClick={handleBack}>
      Назад
    </BlackA>
  );
};

export default BackLink;
