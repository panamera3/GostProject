import "./Login.css";
import LeftColumnLogReg from "../../components/LeftColumnLogReg/LeftColumnLogReg";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserRole from "../../types/user/userRole";
import { toast } from "react-toastify";
import eye from "../../images/eye.svg";
import eye_closed from "../../images/eye_closed.svg";

const Login = () => {
  const navigate = useNavigate();

  const usernameLoginInputRef = useRef();
  const passwordLoginInputRef = useRef();

  const [formValid, setFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();
    const username = usernameLoginInputRef.current.value;
    const password = passwordLoginInputRef.current.value;

    axios({
      method: "post",
      responseType: "json",
      url: `/api/Auth/AuthUser`,
      data: {
        login: `${username}`,
        password: `${password}`,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((user) => {
        const userRole = Object.keys(UserRole).find(
          (key) => UserRole[key] === user.data.role
        );
        localStorage.setItem("token", user.data.token);
        localStorage.setItem("id", user.data.id);
        localStorage.setItem("workCompanyID", user.data.workCompanyID);
        localStorage.setItem("role", userRole);
        localStorage.setItem("isConfirmed", user.data.isConfirmed)
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Неверный логин и/или пароль", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          progress: undefined,
          pauseOnHover: false,
          draggable: false,
        });
      });
  };

  return (
    <>
      <LeftColumnLogReg login>
        <div className="left_column_log_reg_children">
          <form onSubmit={submitHandler} id="login_form">
            <div className="left_column_log_reg_children_form">
              <div className="test_name">
                <h2>Вход</h2>
              </div>
              <div className="test_name">
                <input
                  name="login"
                  id="login_input"
                  type="login"
                  ref={usernameLoginInputRef}
                  placeholder="Логин"
                />
                <div style={{ position: "relative" }}>
                  <input
                    name="password"
                    id="password_input"
                    type={showPassword ? "text" : "password"}
                    ref={passwordLoginInputRef}
                    placeholder="Пароль"
                  />
                  <img
                    src={showPassword ? eye : eye_closed}
                    alt="eye"
                    id="eye_icon"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>
              <button type="submit" className="btn_blue">
                Войти
              </button>
            </div>
          </form>
        </div>
      </LeftColumnLogReg>
    </>
  );
};

export default Login;
