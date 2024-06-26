import "./CompanyRegistration.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserRole from "../../../types/user/userRole";

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
    setCurrentStep(2);
  };

  const handlePrevStep = (event) => {
    event.preventDefault();
    setCurrentStep(1);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const password = passwordCompanyRegistrationInputRef.current.value;
    const confirmPassword =
      confirmPasswordCompanyRegistrationInputRef.current.value;

    if (password == confirmPassword) {
      const psrn = PSRNCompanyRegistrationInputRef.current.value;
      const name = nameCompanyRegistrationInputRef.current.value;
      const email = emailCompanyRegistrationInputRef.current.value;
      const login = loginCompanyRegistrationInputRef.current.value;
      const phoneNumber = phoneNumberCompanyRegistrationInputRef.current.value;
      const fullname = fullnameCompanyRegistrationInputRef.current.value;
      const fullnameString = fullname.split(" ");

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
        },
      })
        .then((newUser) => {
          if (!newUser.data.error) {
            localStorage.setItem("token", newUser.data.token);
            localStorage.setItem("id", newUser.data.id);
            localStorage.setItem("workCompanyID", newUser.data.WorkCompanyID);
            localStorage.setItem("isConfirmed", newUser.data.isConfirmed);
            localStorage.setItem("role", "Admin");
            try {
              localStorage.setItem("example", 1);
            } catch (e) {
              console.error("Error saving data in localStorage:", e);
            }

            navigate("/home");
          } else {
            toast.error(newUser.data.error, {
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
              <button className="btn_blue" onClick={handleNextStep}>
                Далее
              </button>
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
              <button className="btn_blue" onClick={handlePrevStep}>
                Назад
              </button>
              <button className="btn_blue" type="submit">
                Зарегистрироваться
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CompanyRegistration;
