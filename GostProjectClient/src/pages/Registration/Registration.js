import "./Registration.css";
import LeftColumnLogReg from "../../components/LeftColumnLogReg/LeftColumnLogReg";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserRole from "../../types/user/userRole";

const Registration = () => {
  const navigate = useNavigate();

  const refs = {
    usernameRegistrationInputRef: useRef(null),
    passwordRegistrationInputRef: useRef(null),
    passwordConfirmRegistrationInputRef: useRef(null),
    fullnameRegistrationInputRef: useRef(null),
    companyCodeRegistrationInputRef: useRef(null),
    departmentRegistrationInputRef: useRef(null),
  };

  const requiredRegistrationFields = [
    "username",
    "password",
    "passwordConfirm",
    "fullname",
    "companyCode",
  ];

  const submitHandler = (event) => {
    event.preventDefault();

    for (const field of requiredRegistrationFields) {
      const inputRef = refs[`${field}RegistrationInputRef`];
      if (!inputRef.current.value.trim()) {
        toast.error(`Поле "${field}" обязательно для заполнения`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          progress: undefined,
          pauseOnHover: false,
          draggable: false,
        });
        return;
      }
    }

    const password = refs.passwordRegistrationInputRef.current.value;
    const passwordConfirm =
      refs.passwordConfirmRegistrationInputRef.current.value;

    if (password === passwordConfirm) {
      const fullname = refs.fullnameRegistrationInputRef.current.value;
      const fullnameString = fullname.split(" ");

      if (fullnameString.length < 2 || fullnameString.length > 3) {
        toast.error("ФИО должно состоять из 2-3 слов", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          progress: undefined,
          pauseOnHover: false,
          draggable: false,
        });
        return;
      }

      const username = refs.usernameRegistrationInputRef.current.value;
      const companyCode = refs.companyCodeRegistrationInputRef.current.value;
      const department = refs.departmentRegistrationInputRef.current.value;

      axios({
        method: "post",
        responseType: "json",
        url: `/api/Auth/RegisterUser`,
        data: {
          login: username,
          password: password,
          companyCode: companyCode,
          lastName: fullnameString[0],
          firstName: fullnameString[1],
          patronymic: fullnameString[2] || "",
          role: UserRole.Standart,
          department: department,
        },
      })
        .then((user) => {
          if (user.data.role) {
            const userRole = Object.keys(UserRole).find(
              (key) => UserRole[key] === user.data.role
            );
            localStorage.setItem("token", user.data.token);
            localStorage.setItem("id", user.data.id);
            localStorage.setItem("workCompanyID", user.data.WorkCompanyID);
            localStorage.setItem("role", userRole);
            navigate("/home");
          } else {
            toast.error(user.data.error, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              progress: undefined,
              pauseOnHover: false,
              draggable: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      toast.error("Пароли не совпадают");
    }
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
                  type="text"
                  ref={refs.usernameRegistrationInputRef}
                  placeholder="Логин"
                />
                <input
                  name="password"
                  id="password_input"
                  type="password"
                  ref={refs.passwordRegistrationInputRef}
                  placeholder="Пароль"
                />
                <input
                  id="password_confirm_input"
                  type="password"
                  ref={refs.passwordConfirmRegistrationInputRef}
                  placeholder="Подтверждение пароля"
                />
                <input
                  name="fullname"
                  id="fullname_input"
                  ref={refs.fullnameRegistrationInputRef}
                  placeholder="Фамилия Имя Отчество"
                />
                <input
                  name="companyCode"
                  id="companyCode_input"
                  ref={refs.companyCodeRegistrationInputRef}
                  placeholder="Код подключения к организации"
                />
                <input
                  name="department"
                  id="department_input"
                  ref={refs.departmentRegistrationInputRef}
                  placeholder="Департамент"
                />
              </div>
              <button type="submit" className="btn_blue">
                Зарегистрироваться
              </button>
            </div>
          </form>
        </div>
      </LeftColumnLogReg>
    </>
  );
};

export default Registration;
