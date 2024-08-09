import { useEffect, useState } from "react";
import HeaderUser from "../../components/Header/HeaderUser";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import "./MyProfile.css";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";

import { translationRolesDict } from "../../components/constants/translationRolesDict";
import { BodyContainer } from "../../components/styles/styled_components";
import { alertIcon, copyIcon } from "../../assets/images";
import BackLink from "../../components/BackLink/BackLink";

const MyProfile = () => {
  const [user, setUser] = useState({});
  const [company, setCompany] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem("id");
    axios({
      method: "get",
      url: `/api/User/GetUser/${userId}`,
    })
      .then((user) => {
        if (user.data) {
          setUser(user.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (Object.keys(user).length > 0) {
      axios({
        method: "get",
        url: `/api/Company/GetCompany`,
      })
        .then((company) => {
          setCompany(company.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
  const getMonthsText = (months) => {
    const monthsText = ["месяц", "месяца", "месяцев"];
    const monthsIndex =
      months % 100 > 4 && months % 100 < 20
        ? 2
        : [2, 0, 1, 1, 1, 2][months % 10 < 5 ? months % 10 : 5];
    return monthsText[monthsIndex];
  };

  const getYearsText = (years) => {
    const yearsText = ["год", "года", "лет"];
    const yearsIndex =
      years % 100 > 4 && years % 100 < 20
        ? 2
        : [2, 0, 1, 1, 1, 2][years % 10 < 5 ? years % 10 : 5];
    return `${years} ${yearsText[yearsIndex]}`;
  };
  const frequencyOptions = [1, 3, 6, 12];

  const renderFrequencyOptions = () => {
    return (
      <>
        {frequencyOptions.map((option) => {
          const months = option;
          let frequencyText;

          if (months < 12) {
            const monthsText = getMonthsText(months);
            frequencyText = `Раз в ${months} ${monthsText}`;
          } else {
            const years = Math.floor(months / 12);
            const remainingMonths = months % 12;
            const yearsText = getYearsText(years);
            let monthsText = "";

            if (remainingMonths > 0) {
              monthsText = getMonthsText(remainingMonths);
              frequencyText = `Раз в ${yearsText} и ${remainingMonths} ${monthsText}`;
            } else {
              frequencyText = `Раз в ${yearsText}`;
            }
          }

          return (
            <option key={option} value={option}>
              {frequencyText}
            </option>
          );
        })}
      </>
    );
  };

  const handleFrequencyChange = (event) => {
    const selectedFrequency = event.target.value;

    axios({
      method: "post",
      url: `/api/Company/ChangeCodeUpdateFrequency/?months=${selectedFrequency}`,
    })
      .then((company) => {
        setCompany(company.data);
        const dateTimeString = company.data.updateDateCode;
        const dateTime = new Date(dateTimeString);
        const dateOnly = new Date(
          dateTime.getFullYear(),
          dateTime.getMonth(),
          dateTime.getDate()
        );
        const formattedDate = dateOnly
          .toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(/\//g, ".");

        toast.success(
          `Частота обновления кода подключения к организации обновлена и будет производиться раз в ${company.data.codeUpdateFrequencyInMonths} месяцев`,
          {
            autoClose: 20000,
          }
        );
        toast.success(`Код подключения к организации был обновлён`, {
          autoClose: 20000,
        });
        toast.success(
          `Дата обновления кода подключения к организации была обновлена и назначена на ${formattedDate}`,
          {
            autoClose: 20000,
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {localStorage.getItem("role") == "Admin" ? (
        <HeaderAdmin />
      ) : (
        <HeaderUser />
      )}
      <BodyContainer>
        <div className="activities_container">
          <BackLink />
          <a
            href={`/editUser/${localStorage.getItem("id")}`}
            id="editMyProfile"
          >
            Редактировать мой профиль
          </a>
        </div>
        <div className="profile-container">
          <div className="profile-fields-container">
            <div className="user-fields">
              <p className="user-field-name">
                <b>ФИО пользователя</b>
              </p>
              <p className="user-field-value">
                {user &&
                  `${user["lastName"]} ${user["firstName"]} ${user["patronymic"]}`}
              </p>
            </div>
            <div className="user-fields">
              <p className="user-field-name">
                <b>Номер телефона</b>
              </p>
              <p className="user-field-value">{user && user["phoneNumber"]}</p>
            </div>
            <div className="user-fields">
              <p className="user-field-name">
                <b>Логин</b>
              </p>
              <p className="user-field-value">{user && user["login"]}</p>
            </div>
            <div className="user-fields">
              <p className="user-field-name">
                <b>Роль пользователя</b>
              </p>
              <p className="user-field-value">
                {user && translationRolesDict[user["role"]]}
              </p>
            </div>
            <div className="user-fields">
              <p className="user-field-name">
                <b>ОГРН/ОГРНИП</b>
              </p>
              <p className="user-field-value">{company && company["psrn"]}</p>
            </div>
            <div className="user-fields">
              <p className="user-field-name">
                <b>Название организации</b>
              </p>
              <p className="user-field-value">{company && company["name"]}</p>
            </div>
            <div className="user-fields">
              <p className="user-field-name">
                <b>Электронная почта организации</b>
              </p>
              <p className="user-field-value">{company && company["email"]}</p>
            </div>
          </div>
          {localStorage.getItem("role") == "Admin" && (
            <div className="profile-invite">
              <div className="profile-code-container">
                <p>
                  <b>Код-приглашение</b>
                </p>
                <p>{company && company["code"]}</p>
                <CopyToClipboard
                  text={company && company["code"]}
                  onCopy={copyCompanyCode}
                >
                  <img src={copyIcon} alt="copy" />
                </CopyToClipboard>
              </div>
              <div className="profile-frequency-container">
                <div>
                  <b>Частота обновления</b>
                  <img
                    alt="!"
                    src={alertIcon}
                    className="warnForFrequency"
                    title="При выборе частоты обновления текущий код подключения будет обновлён"
                  />
                </div>
                <select onChange={handleFrequencyChange}>
                  {renderFrequencyOptions()}
                </select>
              </div>
            </div>
          )}
        </div>
      </BodyContainer>
    </>
  );
};
export default MyProfile;
