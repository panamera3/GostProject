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

  const submitHandler = (event) => {
    event.preventDefault();
    const username = usernameLoginInputRef.current.value;
    const password = passwordLoginInputRef.current.value;

    axios({
      method: "post",
      responseType: "json",
      url: `https://localhost:7243/api/Auth/AuthUser`,
      data: {
        login: `${username}`,
        password: `${password}`,
      },
    })
      .then((user) => {
        console.log(user.data);
        navigate("/home");
        window.location.reload();
        localStorage.setItem("token", user.data.token);
        localStorage.setItem("id", user.data.id)
        localStorage.setItem("role", user.data.role);
      })
      .catch((error) => {
        console.log(error);
      });
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
              <button type="submit">Войти</button>
            </div>
          </form>
        </div>
      </LeftColumnLogReg>
    </>
  );
};

export default Login;
