import { useEffect } from "react";
import "./LeftColumnLogReg.css";
import { useNavigate } from "react-router-dom";

const LeftColumnLogReg = ({ login, registration, children }) => {
  const navigate = useNavigate();

  const redirectHandler = () => {};

  return (
    <>
      <div id="columns_flex">
        <div id="left_column_log_reg">
          {login && (
            <>
              <h2>Регистрация</h2>
              <p>
                Впервые на платформе? Необходимо зарегистрироваться по кнопке
                ниже
              </p>
              <button
                className="btn_white"
                type="button"
                onClick={() => {
                  navigate("/registration");
                }}
              >
                Зарегистрироваться
              </button>
            </>
          )}
          {registration && (
            <>
              <h2>Вход</h2>
              <p>Уже есть аккаунт? Вы можете войти в него по кнопке ниже</p>
              <button
                className="btn_white"
                type="button"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Войти
              </button>
            </>
          )}
        </div>
        {children}
      </div>
    </>
  );
};

export default LeftColumnLogReg;
