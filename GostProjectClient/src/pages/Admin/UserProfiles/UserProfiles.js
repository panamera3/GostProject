// styles
import axios from "axios";
import HeaderAdmin from "../../../components/HeaderAdmin/HeaderAdmin";
import "./UserProfiles.css";
// components
// libraries
import { useState, useEffect, useRef } from "react";
import UserRole from "../../../types/user/userRole";

const UserProfiles = () => {
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

  const renderUsers = () => {
    if (users) {
      return users.map((user) => (
        <tr key={user.id}>
          <td>
            <p>{user.login}</p>
          </td>
          <td>
            <p>
              {user.lastName} {user.firstName} {user.patronymic}
            </p>
          </td>
          <td>
            <p>{user.login}</p>
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
          <td></td>
          <td></td>
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
        <table>
          <thead>
            <tr>
              <th scope="col">Логин</th>
              <th scope="col">ФИО пользователя</th>
              <th scope="col">Подразделение</th>
              <th scope="col">Роль</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>{renderUsers()}</tbody>
        </table>
      </div>
    </>
  );
};

export default UserProfiles;
