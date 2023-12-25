// styles
import "./Registration.css";
// components
import LeftColumnLogReg from "../../components/LeftColumnLogReg/LeftColumnLogReg";
// libraries
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
//import axios from "axios";

const Registration = () => {
  const navigate = useNavigate();
  const usernameRegistrationInputRef = useRef();
  const passwordRegistrationInputRef = useRef();

  const submitHandler = () => {
    console.log("example");
    navigate("/home");
  };

  return (
    <>
      <LeftColumnLogReg registration>
        <div className="left_column_log_reg_children">
          <form onSubmit={submitHandler}>
            <div>
              <h2>Регистрация</h2>
            </div>
            <div>
              <input
                name="login"
                id="login_input"
                type="login"
                ref={usernameRegistrationInputRef}
                placeholder="Логин"
              />
              <input
                name="password"
                id="password_input"
                type="password"
                ref={passwordRegistrationInputRef}
                placeholder="Пароль"
              />
              <input
                id="password_confirm_input"
                type="password"
                placeholder="Подтверждение пароля"
              />
              <input
                name="fullname"
                id="fullname_input"
                placeholder="Фамилия Имя Отчество"
              />
            </div>
            <button type="sumbit">Зарегистрироваться</button>
          </form>
        </div>
      </LeftColumnLogReg>
    </>
  );
};

export default Registration;
