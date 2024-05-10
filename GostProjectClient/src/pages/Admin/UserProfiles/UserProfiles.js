// styles
import axios from "axios";
import HeaderAdmin from "../../../components/HeaderAdmin/HeaderAdmin";
import "./UserProfiles.css";
// components
// libraries
import { useState, useEffect, useRef } from "react";
import UserRole from "../../../types/user/userRole";
// images
import deleteImg from "../../../images/delete.svg";
import editImg from "../../../images/edit.svg";
import { useNavigate } from "react-router-dom";

const UserProfiles = () => {
  const navigate = useNavigate();

  // страница с таблицей всех пользоваетелей организации
  const [users, setUsers] = useState();

  const roleTranslations = {
    Admin: "Администратор",
    Standart: "Обычный пользователь",
  };

  useEffect(() => {
    axios({
      method: "get",
      url: `https://localhost:7243/api/User/GetUsers`,
      //headers: { Authorization: `Bearer ${userToken}` },
    })
      .then((users) => {
        setUsers(users.data);
        console.log("users", users.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const changeDepartment = () => {
    return 0;
  };

  const renderOptions = () => {
    if (users) {
      return users.map((user) => <option>user.department</option>);
    }
  };

  const renderUsers = () => {
    if (users) {
      return users.map((user) => (
        <tr key={user.id}>
          <td>
            <p>{user.id}</p>
          </td>
          <td>
            <p>{user.department}</p>
          </td>
          <td>
            <p>
              {
                roleTranslations[
                  Object.keys(UserRole).find(
                    (key) => UserRole[key] === user.role
                  )
                ]
              }
            </p>
          </td>
          <td>
            <p>
              {user.lastName} {user.firstName} {user.patronymic}
            </p>
          </td>
          <td>
            <img
              src={editImg}
              alt="редактировать"
              onClick={() => {
                navigate(`/editUser`);
              }}
            />
          </td>
          <td>
            <img
              src={deleteImg}
              alt="удалить"
              onClick={() => {
                console.log(1);
              }}
            />
          </td>
        </tr>
      ));
    }
  };

  return (
    <>
      <HeaderAdmin />
      <div className="body_container">
        <div className="activities_container">
          <a href="/home">Назад</a>
        </div>
        <select placeholder="Отдел" onChange={() => changeDepartment()}>
          <option>example</option>
          {/*
            renderOptions()
            */}
        </select>
        <table className="user_profiles_table">
          <thead>
            <tr>
              <th scope="col">№</th>
              <th scope="col">Отдел</th>
              <th scope="col">Роль</th>
              <th scope="col">ФИО пользователя</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>{renderUsers()}</tbody>
        </table>
      </div>
    </>
  );
};

export default UserProfiles;
