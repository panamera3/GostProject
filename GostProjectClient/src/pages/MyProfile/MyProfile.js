import { useEffect, useState } from "react";
import HeaderUser from "../../components/Header/HeaderUser";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import "./MyProfile.css";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import copy from "../../images/copy.svg";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";

import { translationRolesDict } from "../../components/constants/translationRolesDict";

const MyProfile = () => {
  const [user, setUser] = useState({});
  const [company, setCompany] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem("id");
    axios({
      method: "get",
      url: `/api/User/GetUser/${userId}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((user) => {
        setUser(user.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios({
      method: "get",
      url: `/api/Company/GetCompany/${user.workCompanyID}`,
    })
      .then((company) => {
        setCompany(company.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  const copyCompanyCode = () => {
    toast.success("Код успешно скопирован в буфер обмена!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      progress: undefined,
      pauseOnHover: false,
      draggable: false,
    });
  };

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
            <div className="user-fields">
              <p className="user-field-name">
                <b>ФИО пользователя</b>
              </p>
              <p className="user-field-value">
                {`${user["lastName"]} ${user["firstName"]} ${user["patronymic"]}`}
              </p>
            </div>
            <div className="user-fields">
              <p className="user-field-name">
                <b>Номер телефона</b>
              </p>
              <p className="user-field-value">{user["phoneNumber"]}</p>
            </div>
            <div className="user-fields">
              <p className="user-field-name">
                <b>Электронная почта</b>
              </p>
              <p className="user-field-value">{user["email"]}</p>
            </div>
            <div className="user-fields">
              <p className="user-field-name">
                <b>Логин</b>
              </p>
              <p className="user-field-value">{user["login"]}</p>
            </div>
            <div className="user-fields">
              <p className="user-field-name">
                <b>Роль пользователя</b>
              </p>
              <p className="user-field-value">
                {translationRolesDict[user["role"]]}
              </p>
            </div>
            <div className="user-fields">
              <p className="user-field-name">
                <b>ОГРН/ОГРНИП</b>
              </p>
              <p className="user-field-value">{company["psrn"]}</p>
            </div>
            <div className="user-fields">
              <p className="user-field-name">
                <b>Название организации</b>
              </p>
              <p className="user-field-value">{company["name"]}</p>
            </div>
          </div>
          {localStorage.getItem("role") == "Admin" && (
            <div className="profile-invite">
              <div className="profile-code-container">
                <p>
                  <b>Код-приглашение</b>
                </p>
                <p>{company["code"]}</p>
                <CopyToClipboard
                  text={company["code"]}
                  onCopy={copyCompanyCode}
                >
                  <img src={copy} alt="copy" />
                </CopyToClipboard>
              </div>
              <div className="profile-frequency-container">
                <p>
                  <b>Частота обновления</b>
                </p>
                <p>text</p>
              </div>
            </div>
          )}
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
