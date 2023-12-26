// styles
import "./Login.css";
// components
import LeftColumnLogReg from "../../components/LeftColumnLogReg/LeftColumnLogReg";
// libraries
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const usernameLoginInputRef = useRef();
  const passwordLoginInputRef = useRef();

  const [formValid, setFormValid] = useState(false);

  const submitHandler = () => {
    navigate("/home");
    window.location.reload();
  };

  return (
    <>
      <LeftColumnLogReg login>
        <div className="left_column_log_reg_children">
          <form onSubmit={submitHandler}>
            <div className="left_column_log_reg_children_form">
              <div>
                <h2>Вход</h2>
              </div>
              <div>
                <input
                  name="login"
                  id="login_input"
                  type="login"
                  ref={usernameLoginInputRef}
                  placeholder="Логин"
                />
                <input
                  name="password"
                  id="password_input"
                  type="password"
                  ref={passwordLoginInputRef}
                  placeholder="Пароль"
                />
              </div>
              <div>
                <input
                  id="checkbox_remember"
                  type="checkbox"
                  style={{ width: "auto" }}
                />
                <label for="checkbox_remember">Запомнить меня</label>
              </div>
              <button type="submit">Войти</button>
            </div>
          </form>
        </div>
      </LeftColumnLogReg>
    </>
  );
};

export default Login;
