import { useEffect } from "react";
import "./NotConfirmed.css";
import { useNavigate } from "react-router-dom";
import { BtnBlue } from "../../components/styles/styled_components";

const NotConfirmed = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const isConfirmed = localStorage.getItem("isConfirmed") === "true";
    if (isConfirmed) {
      navigate("/home");
    }
  }, [navigate]);
  
  return (
    <>
      <div className="notconfirmed-container">
        <h1>
          Дождитесь подтверждения своего аккаунта администратором компании.
        </h1>
        <BtnBlue onClick={() => navigate("/login")}>
          На страницу авторизации
        </BtnBlue>
      </div>
    </>
  );
};

export default NotConfirmed;
