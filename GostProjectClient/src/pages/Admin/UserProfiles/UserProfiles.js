// styles
import HeaderAdmin from "../../../components/HeaderAdmin/HeaderAdmin";
import "./UserProfiles.css";
// components
// libraries
import { useState, useEffect, useRef } from "react";

const UserProfiles = () => {
  // страница с таблицей всех пользоваетелей организации
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
              <th scope="col">Роль</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
              <td>4</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserProfiles;
