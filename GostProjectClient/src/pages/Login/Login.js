// styles
import "./Login.css";
// components
// libraries
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
//import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const usernameLoginInputRef = useRef();
  const passwordLoginInputRef = useRef();

  const usernameRegistrationInputRef = useRef();
  const passwordRegistrationInputRef = useRef();

  const [isRegistration, setIsRegistration] = useState(false);
  const [formValid, setFormValid] = useState(false);

  const submitHandler = () => {
    console.log("Something")
  }

  return (
    <>
      <form onSubmit={submitHandler}>
        {!isRegistration && (
          <>
            <div>
              <h2>Вход</h2>
            </div>
            <div>
              <div>
                <label for="email_input">
                  Почта:
                </label>
                <input
                  name="email"
                  id="email_input"
                  type="email"
                  ref={usernameLoginInputRef}
                />
              </div>
              <div>
                <label for="password_input">
                  Пароль:
                </label>
                <input
                  name="password"
                  id="password_input"
                  type="password"
                  ref={passwordLoginInputRef}
                />
              </div>
            </div>
          </>
        )}

        {isRegistration && (
          <>
            <div>
              <h2>Регистрация</h2>
            </div>
            <div>
              <div>
                <label for="email__input">
                  Почта:
                </label>
                <input
                  name="email"
                  id="email__input"
                  type="email"
                  placeholder="example@example.com"
                  ref={usernameRegistrationInputRef}
                />
              </div>
              <div>
                <label for="password_input">
                  Придумайте пароль:
                </label>
                <input
                  name="password"
                  id="password_input"
                  type="password"
                  placeholder="qwerty"
                  ref={passwordRegistrationInputRef}
                />
              </div>
            </div>
          </>
        )}
        <button disabled={!formValid} type="submit">
          Продолжить
        </button>
      </form>
      {!isRegistration && (
        <div>
          <button
            type="button"
            onClick={() => {
              setIsRegistration(true);
            }}
          >
            Регистрация
          </button>
        </div>
      )}
      {isRegistration && (
        <div>
          <button
            type="button"
            onClick={() => {
              setIsRegistration(false);
            }}
          >
            Вход
          </button>
        </div>
      )}
    </>
  );
};

export default Login;
