// styles
import "./CompanyRegistration.css";
// libraries
import { useState, useEffect, useRef } from "react";

const CompanyRegistration = () => {
  const PSRNCompanyRegistrationInputRef = useRef();
  const nameCompanyRegistrationInputRef = useRef();
  const emailCompanyRegistrationInputRef = useRef();

  const fullnameCompanyRegistrationInputRef = useRef();
  const phoneNumberCompanyRegistrationInputRef = useRef();
  const passwordCompanyRegistrationInputRef = useRef();
  const confirmPasswordCompanyRegistrationInputRef = useRef();

  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  return (
    <>
      <div className="company-registration-container">
        <div className="company-registration-title">
          <h1>Хранилище ГОСТов</h1>
          <p>Регистрация</p>
        </div>
        <div className="step-container">
          <div
            className={
              currentStep !== 1
                ? "step first-step step-hidden"
                : "step first-step"
            }
          >
            <input
              name="login"
              id="login_input"
              type="login"
              ref={PSRNCompanyRegistrationInputRef}
              placeholder="ОГРН/ОГРНИП"
            />
            <input
              name="login"
              id="login_input"
              type="login"
              ref={nameCompanyRegistrationInputRef}
              placeholder="Название организации"
            />
            <input
              name="login"
              id="login_input"
              type="login"
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
              type="fullname"
              ref={fullnameCompanyRegistrationInputRef}
              placeholder="ФИО(полностью)"
            />
            <input
              name="phoneNumber"
              id="phoneNumber_input"
              type="phoneNumber"
              ref={phoneNumberCompanyRegistrationInputRef}
              placeholder="Номер телефона"
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
              type="confirmPassword"
              ref={confirmPasswordCompanyRegistrationInputRef}
              placeholder="Подтверждение пароля"
            />
            <button className="btn_blue" onClick={handlePrevStep}>
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyRegistration;
