import "./Registration.css";
import LeftColumnLogReg from "../../components/LeftColumnLogReg/LeftColumnLogReg";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserRole from "../../types/user/userRole";
import { BtnBlue, Input } from "../../components/styles/styled_components";

const Registration = () => {
  const navigate = useNavigate();

  const [fieldValidity, setFieldValidity] = useState({
    username: true,
    password: true,
    passwordConfirm: true,
    fullname: true,
    companyCode: true,
  });

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
    let isFormValid = true;

    for (const field of requiredRegistrationFields) {
      const inputRef = refs[`${field}RegistrationInputRef`];
      const value = inputRef.current.value.trim();

      if (!(value.length > 0)) {
        setFieldValidity((prevState) => ({
          ...prevState,
          [field]: false,
        }));
        isFormValid = false;
      } else {
        setFieldValidity((prevState) => ({
          ...prevState,
          [field]: true,
        }));
      }
    }

    if (isFormValid) {
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
              localStorage.setItem("id", user.data.id);
              localStorage.setItem("workCompanyID", user.data.WorkCompanyID);
              localStorage.setItem("refreshToken", user.data.refreshToken);
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
            toast.error(error.response.data.error);
          });
      } else {
        toast.error("Пароли не совпадают");
      }
    } else {
      toast.error("Заполните все обязательные поля");
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
                <Input
                  name="login"
                  id="login_input"
                  type="text"
                  ref={refs.usernameRegistrationInputRef}
                  placeholder="Логин"
                  isInvalid={!fieldValidity.username}
                />
                <Input
                  name="password"
                  id="password_input"
                  type="password"
                  ref={refs.passwordRegistrationInputRef}
                  placeholder="Пароль"
                  isInvalid={!fieldValidity.password}
                />
                <Input
                  name="password_confirm"
                  id="password_confirm_input"
                  type="password"
                  ref={refs.passwordConfirmRegistrationInputRef}
                  placeholder="Подтверждение пароля"
                  isInvalid={!fieldValidity.passwordConfirm}
                />
                <Input
                  name="fullname"
                  id="fullname_input"
                  ref={refs.fullnameRegistrationInputRef}
                  placeholder="Фамилия Имя Отчество"
                  isInvalid={!fieldValidity.fullname}
                />
                <Input
                  name="companyCode"
                  id="companyCode_input"
                  ref={refs.companyCodeRegistrationInputRef}
                  placeholder="Код подключения к организации"
                  isInvalid={!fieldValidity.companyCode}
                />
                <Input
                  name="department"
                  id="department_input"
                  ref={refs.departmentRegistrationInputRef}
                  placeholder="Департамент"
                />
              </div>
              <BtnBlue type="submit">Зарегистрироваться</BtnBlue>
            </div>
          </form>
        </div>
      </LeftColumnLogReg>
    </>
  );
};

export default Registration;
