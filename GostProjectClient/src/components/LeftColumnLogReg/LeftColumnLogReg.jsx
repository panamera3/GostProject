import "./LeftColumnLogReg.css";
import { useNavigate } from "react-router-dom";
import { BtnWhite } from "../styles/styled_components";

const LeftColumnLogReg = ({ login, registration, children }) => {
  const navigate = useNavigate();

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
              <BtnWhite
                type="button"
                onClick={() => {
                  navigate("/registration");
                }}
              >
                Зарегистрироваться
              </BtnWhite>
            </>
          )}
          {registration && (
            <>
              <h2>Вход</h2>
              <p>Уже есть аккаунт? Вы можете войти в него по кнопке ниже</p>
              <BtnWhite
                type="button"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Войти
              </BtnWhite>
            </>
          )}
        </div>
        {children}
      </div>
    </>
  );
};

export default LeftColumnLogReg;
