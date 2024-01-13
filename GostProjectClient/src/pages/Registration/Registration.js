// styles
import "./Registration.css";
// components
import LeftColumnLogReg from "../../components/LeftColumnLogReg/LeftColumnLogReg";
// libraries
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Registration = () => {
  const navigate = useNavigate();
  const usernameRegistrationInputRef = useRef();
  const passwordRegistrationInputRef = useRef();
  const fullnameRegistrationInputRef = useRef();
  const companyCodeRegistrationInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    const username = usernameRegistrationInputRef.current.value;
    const password = passwordRegistrationInputRef.current.value;
    const companyCode = companyCodeRegistrationInputRef.current.value;
    const fullname = fullnameRegistrationInputRef.current.value;
    const fullnameString = fullname.split(" ");

    axios({
      method: "post",
      responseType: "json",
      url: `https://localhost:7243/api/Auth/RegisterUser`,
      data: {
        login: `${username}`,
        password: `${password}`,
        companyCode: `${companyCode}`,
        lastName: `${fullnameString[0]}`,
        firstName: `${fullnameString[1]}`,
        patronymic: `${fullnameString[2] ? fullnameString[2] : ""}`,
        role: 2,
      },
    })
      .then((user) => {
        console.log(user.data);
        navigate("/home");
        window.location.reload();
        localStorage.setItem("token", user.data.token)
        localStorage.setItem("id", user.data.id)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <LeftColumnLogReg registration>
        <div className="left_column_log_reg_children">
          <form onSubmit={submitHandler}>
            <div className="left_column_log_reg_children_form">
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
                  ref={fullnameRegistrationInputRef}
                  placeholder="Фамилия Имя Отчество"
                />
                <input
                  name="companyCode"
                  id="companyCode_input"
                  ref={companyCodeRegistrationInputRef}
                  placeholder="Код подключения к организации"
                />
              </div>
              <button type="submit">Зарегистрироваться</button>
            </div>
          </form>
        </div>
      </LeftColumnLogReg>
    </>
  );
};

export default Registration;
