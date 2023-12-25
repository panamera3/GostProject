//styles
import { useEffect } from "react";
import "./LeftColumnLogReg.css";
// libraries
import { useNavigate } from "react-router-dom";

const LeftColumnLogReg = (props) => {
  const navigate = useNavigate();

  const redirectHandler = () => {};

  useEffect(() => {
    console.log(props);
  });

  return (
    <>
      <div id="columns_flex">
        <div id="left_column_log_reg">
          {props.login && (
            <>
              <h2>Регистрация</h2>
              <p>
                Впервые на платформе? Необходимо зарегистрироваться по кнопке
                ниже
              </p>
              <button
                type="button"
                onClick={() => {
                  navigate("/registration");
                }}
              >
                Зарегистрироваться
              </button>
            </>
          )}
          {props.registration && (
            <>
              <h2>Вход</h2>
              <p>Уже есть аккаунт? Вы можете войти в него по кнопке ниже</p>
              <button type="button" onClick={() => {
                  navigate("/login");
                }}>
                Войти
              </button>
            </>
          )}
        </div>
        {props.children}
      </div>
    </>
  );
};

export default LeftColumnLogReg;
