import "./CompanyRegistration.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserRole from "../../../types/user/userRole";
import { BtnBlue, Input } from "../../../components/styles/styled_components";

const CompanyRegistration = () => {
  const navigate = useNavigate();
  const PSRNCompanyRegistrationInputRef = useRef();
  const nameCompanyRegistrationInputRef = useRef();
  const emailCompanyRegistrationInputRef = useRef();

  const fullnameCompanyRegistrationInputRef = useRef();
  const phoneNumberCompanyRegistrationInputRef = useRef();
  const loginCompanyRegistrationInputRef = useRef();
  const passwordCompanyRegistrationInputRef = useRef();
  const confirmPasswordCompanyRegistrationInputRef = useRef();

  const [currentStep, setCurrentStep] = useState(1);

  const [inputValidity, setInputValidity] = useState({
    psrn: true,
    name: true,
    email: true,
    fullname: true,
    phoneNumber: true,
    login: true,
    password: true,
    confirmPassword: true,
  });

  const handleNextStep = (event) => {
    event.preventDefault();

    const psrn = PSRNCompanyRegistrationInputRef.current.value;
    const psrnRegex = /^\d+$/;
    const name = nameCompanyRegistrationInputRef.current.value;
    const email = emailCompanyRegistrationInputRef.current.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const newValidity = {
      psrn: !!psrn,
      name: !!name,
      email: emailRegex.test(email),
    };

    setInputValidity((prev) => ({ ...prev, ...newValidity }));

    if (!psrnRegex.test(psrn)) {
      toast.error("ОГРН должен содержать только цифры");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Некорректный email");
      return;
    }

    if (Object.values(newValidity).every((valid) => valid)) {
      setCurrentStep(2);
    } else {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }
  };

  const handlePrevStep = (event) => {
    event.preventDefault();
    setCurrentStep(1);
  };

  const capitalizeFirstLetter = (str) => {
    return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const password = passwordCompanyRegistrationInputRef.current.value;
    const confirmPassword =
      confirmPasswordCompanyRegistrationInputRef.current.value;

    const fullname = fullnameCompanyRegistrationInputRef.current.value;
    var fullnameString = fullname.split(" ");

    const phoneNumber = phoneNumberCompanyRegistrationInputRef.current.value;
    const phoneNumberRegex =
      /^\+?\d{1,3}?[-\s]?\(?\d{1,3}\)?[-\s]?\d{1,4}[-\s]?\d{1,4}$/;

    const psrn = PSRNCompanyRegistrationInputRef.current.value;
    const name = nameCompanyRegistrationInputRef.current.value;
    const email = emailCompanyRegistrationInputRef.current.value;
    const login = loginCompanyRegistrationInputRef.current.value;

    const newValidity = {
      fullname: !!fullname,
      phoneNumber: phoneNumberRegex.test(phoneNumber),
      login: !!login,
      password: !!password,
      confirmPassword: !!confirmPassword && password === confirmPassword,
    };

    setInputValidity((prev) => ({ ...prev, ...newValidity }));

    if (Object.values(newValidity).every((valid) => valid)) {
      if (password == confirmPassword) {
        if (fullnameString.length < 2 || fullnameString.length > 3) {
          toast.error("ФИО должно состоять из 2-3 слов");
          return;
        }
        fullnameString = fullnameString.map(capitalizeFirstLetter);
        if (!phoneNumberRegex.test(phoneNumber)) {
          toast.error("Некорректный номер телефона");
          return;
        }

        axios({
          method: "post",
          responseType: "json",
          url: `/api/Auth/RegisterCompany`,
          data: {
            login: `${login}`,
            password: `${password}`,
            email: `${email}`,
            lastName: `${fullnameString[0]}`,
            firstName: `${fullnameString[1]}`,
            patronymic: `${fullnameString[2] ? fullnameString[2] : ""}`,
            psrn: `${psrn}`,
            name: `${name}`,
            role: UserRole.Admin,
            phoneNumber: `${phoneNumber}`,
          },
        })
          .then((newUser) => {
            if (!newUser.data.error) {
              localStorage.setItem("id", newUser.data.id);
              localStorage.setItem("workCompanyID", newUser.data.workCompanyID);
              localStorage.setItem("isConfirmed", newUser.data.isConfirmed);
              localStorage.setItem("refreshToken", newUser.data.refreshToken);
              localStorage.setItem("role", "Admin");

              navigate("/myProfile");
            } else {
              toast.error(newUser.data.error);
            }
          })
          .catch((error) => {
            toast.error(error.response.data.error);
          });
      } else {
        toast.error("Пароли не совпадают");
      }
    } else {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }
  };

  return (
    <>
      <div
        className={
          currentStep == 1
            ? "company-registration-container first_step"
            : "company-registration-container"
        }
      >
        <div
          className={
            currentStep !== 2
              ? "back_container second-step step-hidden"
              : "back_container second-step"
          }
        >
          <p id="back" onClick={handlePrevStep}>
            Назад
          </p>
        </div>
        <div className="company-registration-title">
          <h1>Хранилище ГОСТов</h1>
          <p>Регистрация</p>
        </div>
        <form className="company_registration_form" onSubmit={submitHandler}>
          <div className="step-container">
            <div
              className={
                currentStep !== 1
                  ? "step first-step step-hidden"
                  : "step first-step"
              }
            >
              <Input
                name="psrn"
                id="psrn_input"
                ref={PSRNCompanyRegistrationInputRef}
                isInvalid={!inputValidity.psrn}
                placeholder="ОГРН/ОГРНИП"
              />
              <Input
                name="name"
                id="name_input"
                ref={nameCompanyRegistrationInputRef}
                isInvalid={!inputValidity.name}
                placeholder="Название организации"
              />
              <Input
                name="email"
                id="email_input"
                ref={emailCompanyRegistrationInputRef}
                isInvalid={!inputValidity.email}
                placeholder="Электронная почта"
              />
              <BtnBlue onClick={handleNextStep}>Далее</BtnBlue>
            </div>
            <div
              className={
                currentStep !== 2
                  ? "step second-step step-hidden"
                  : "step second-step"
              }
            >
              <Input
                name="fullname"
                id="fullname_input"
                ref={fullnameCompanyRegistrationInputRef}
                isInvalid={!inputValidity.fullname}
                placeholder="ФИО(полностью)"
              />
              <Input
                name="phoneNumber"
                id="phoneNumber_input"
                ref={phoneNumberCompanyRegistrationInputRef}
                isInvalid={!inputValidity.phoneNumber}
                placeholder="Номер телефона"
              />
              <Input
                name="login"
                id="login_input"
                ref={loginCompanyRegistrationInputRef}
                isInvalid={!inputValidity.login}
                placeholder="Логин"
              />
              <Input
                name="password"
                id="password_input"
                type="password"
                ref={passwordCompanyRegistrationInputRef}
                isInvalid={!inputValidity.password}
                placeholder="Пароль"
              />
              <Input
                name="confirmPassword"
                id="confirmPassword_input"
                type="password"
                ref={confirmPasswordCompanyRegistrationInputRef}
                isInvalid={!inputValidity.confirmPassword}
                placeholder="Подтверждение пароля"
              />
              <BtnBlue type="submit">Зарегистрироваться</BtnBlue>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CompanyRegistration;
