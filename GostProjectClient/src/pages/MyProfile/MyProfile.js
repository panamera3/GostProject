import { useEffect, useState } from "react";
import HeaderUser from "../../components/Header/HeaderUser";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import "./MyProfile.css";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import copy from "../../images/copy.svg";

const MyProfile = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem("id");
    axios({
      method: "get",
      url: `https://localhost:7243/api/User/GetUser/${userId}`,
      //headers: { Authorization: `Bearer ${userToken}` },
    })
      .then((user) => {
        setUser(user.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      {localStorage.getItem("role") == "Admin" ? (
        <HeaderAdmin />
      ) : (
        <HeaderUser />
      )}
      <div className="body_container">
        <div className="activities_container">
          <a href="/home">Назад</a>
        </div>
        <div className="profile-container">
          <div className="profile-fields-container">
            {
              /*
                ФИО пользователя
                Номер телефона
                Логин
                Роль пользователя
                ОГРН/ОГРНИП
                Название организации
                Электронная почта
              */
            }
            {Object.keys(user).map((key) => (
              <div className="user-fields">
                <p className="user-field-name">
                  <b>{key}</b>
                </p>
                <p className="user-field-value">{user[key]}</p>
              </div>
            ))}
          </div>
          <div className="profile-invite">
            <div className="profile-code-container">
              <p>
                <b>Код-приглашение</b>
              </p>
              <p>text</p>
              <img src={copy} alt="copy" />
            </div>
            <div className="profile-frequency-container">
              <p>
                <b>Частота обновления</b>
              </p>
              <p>text</p>
            </div>
          </div>
          <div className="buttons">
            <button className="btn_blue">Сохранить</button>
            <button className="btn_gray">Отменить</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default MyProfile;
