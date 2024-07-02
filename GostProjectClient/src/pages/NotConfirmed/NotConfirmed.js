import { useEffect } from "react";
import "./NotConfirmed.css";
import { useNavigate } from "react-router-dom";

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
        <button onClick={() => navigate("/login")} className="btn_blue">
          На страницу авторизации
        </button>
      </div>
    </>
  );
};

export default NotConfirmed;
