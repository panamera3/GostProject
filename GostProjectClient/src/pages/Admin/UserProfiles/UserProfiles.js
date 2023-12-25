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
          <tr>
            <td>5</td>
            <td>6</td>
            <td>7</td>
            <td>8</td>
            <td>8</td>
          </tr>
        </tbody>
      </table>
      <p>userprof</p>
    </>
  );
};

export default UserProfiles;
