import "./CompanyRegistration.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserRole from "../../../types/user/userRole";
import { BtnBlue, BtnMidGray } from "../../../components/styles/styled_components";

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

  const handleNextStep = (event) => {
    event.preventDefault();
    const psrn = PSRNCompanyRegistrationInputRef.current.value;
    if (!/^\d+$/.test(psrn)) {
      toast.error("ОГРН должен содержать только цифры", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        progress: undefined,
        pauseOnHover: false,
        draggable: false,
      });
      return;
    }

    const email = emailCompanyRegistrationInputRef.current.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Некорректный email", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        progress: undefined,
        pauseOnHover: false,
        draggable: false,
      });
      return;
    }

    setCurrentStep(2);
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

    if (password == confirmPassword) {
      const fullname = fullnameCompanyRegistrationInputRef.current.value;
      var fullnameString = fullname.split(" ");
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
      fullnameString = fullnameString.map(capitalizeFirstLetter);

      const phoneNumber = phoneNumberCompanyRegistrationInputRef.current.value;
      const phoneNumberRegex =
        /^\+?\d{1,3}?[-\s]?\(?\d{1,3}\)?[-\s]?\d{1,4}[-\s]?\d{1,4}$/;
      if (!phoneNumberRegex.test(phoneNumber)) {
        toast.error("Некорректный номер телефона", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          progress: undefined,
          pauseOnHover: false,
          draggable: false,
        });
        return;
      }

      const psrn = PSRNCompanyRegistrationInputRef.current.value;
      const name = nameCompanyRegistrationInputRef.current.value;
      const email = emailCompanyRegistrationInputRef.current.value;
      const login = loginCompanyRegistrationInputRef.current.value;
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
            localStorage.setItem("role", "Admin");

            navigate("/myProfile");
          } else {
            toast.error(newUser.data.error);
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    } else {
      toast.error("Пароли не совпадают", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        progress: undefined,
        pauseOnHover: false,
        draggable: false,
      });
    }
  };

  return (
    <>
      <div className="company-registration-container">
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
              <input
                name="psrn"
                id="psrn_input"
                ref={PSRNCompanyRegistrationInputRef}
                placeholder="ОГРН/ОГРНИП"
              />
              <input
                name="name"
                id="name_input"
                ref={nameCompanyRegistrationInputRef}
                placeholder="Название организации"
              />
              <input
                name="email"
                id="email_input"
                ref={emailCompanyRegistrationInputRef}
                placeholder="Электронная почта"
              />
              <BtnBlue onClick={handleNextStep}>
                Далее
              </BtnBlue>
            </div>
            <div
              className={
                currentStep !== 2
                  ? "step second-step step-hidden"
                  : "step second-step"
              }
            >
              <input
                name="fullname"
                id="fullname_input"
                ref={fullnameCompanyRegistrationInputRef}
                placeholder="ФИО(полностью)"
              />
              <input
                name="phoneNumber"
                id="phoneNumber_input"
                ref={phoneNumberCompanyRegistrationInputRef}
                placeholder="Номер телефона"
              />
              <input
                name="login"
                id="login_input"
                ref={loginCompanyRegistrationInputRef}
                placeholder="Логин"
              />
              <input
                name="password"
                id="password_input"
                type="password"
                ref={passwordCompanyRegistrationInputRef}
                placeholder="Пароль"
              />
              <input
                name="confirmPassword"
                id="confirmPassword_input"
                type="password"
                ref={confirmPasswordCompanyRegistrationInputRef}
                placeholder="Подтверждение пароля"
              />
              <BtnMidGray onClick={handlePrevStep}>
                Назад
              </BtnMidGray>
              <BtnBlue type="submit">
                Зарегистрироваться
              </BtnBlue>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CompanyRegistration;
