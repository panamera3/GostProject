// styles
import axios from "axios";
import HeaderAdmin from "../../../components/HeaderAdmin/HeaderAdmin";
import "./UserProfiles.css";
// components
// libraries
import { useState, useEffect, useRef } from "react";
import UserRole from "../../../types/user/userRole";
import Modal from "../../../components/Modal/Modal";
// images
import deleteImg from "../../../images/delete.svg";
import editImg from "../../../images/edit.svg";
import { useNavigate } from "react-router-dom";

const UserProfiles = () => {
  const navigate = useNavigate();

  // страница с таблицей всех пользоваетелей организации
  const [users, setUsers] = useState();
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState();
  const [fullnameDeleteUserArray, setFullnameDeleteUserArray] = useState([]);

  const roleTranslations = {
    Admin: "Администратор",
    Standart: "Обычный пользователь",
  };

  useEffect(() => {
    updateUsers();
  }, []);

  const updateUsers = () => {
    axios({
      method: "get",
      url: `/api/User/GetUsers`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((users) => {
        setUsers(users.data);
        console.log("users", users.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeDepartment = () => {
    return 0;
  };

  const renderOptions = () => {
    if (users) {
      var departmentsSet = [...new Set(users.map((user) => user.department))];
      return departmentsSet.map((department) => <option>{department}</option>);
    }
  };

  const openModalDelete = (userId, fullnameArray) => {
    setIsModalDeleteOpen(true);
    console.log(userId, userId);
    setDeleteUserId(userId);
    setFullnameDeleteUserArray(fullnameArray);
  };
  const closeModalDelete = () => {
    setIsModalDeleteOpen(false);
  };

  useEffect(() => {
    console.log(isModalDeleteOpen);
  }, [isModalDeleteOpen]);

  const deleteUser = () => {
    axios({
      method: "delete",
      url: `/api/User/DeleteUser/${deleteUserId}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        closeModalDelete();
        updateUsers();
      })
      .catch((error) => {
        console.log(error);
      });
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
                navigate(`/editUser/${user.id}`);
              }}
            />
          </td>
          <td>
            <img
              src={deleteImg}
              alt="удалить"
              onClick={() =>
                openModalDelete(user.id, [
                  user.lastName,
                  user.firstName,
                  user.patronymic,
                ])
              }
            />
          </td>
        </tr>
      ));
    }
  };

  const filterUsers = () => {
    console.log(1);
    /*
    axios({
      method: "post",
      url: `/api/User/GetUsers`,
      data: {
        fullname: "example",
      },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((filteredUsers) => {
        setUsers(filteredUsers.data);
        console.log("filteredUsers", filteredUsers.data);
      })
      .catch((error) => {
        console.log(error);
      });
      */
  };

  return (
    <>
      <HeaderAdmin />
      <div className="body_container">
        <div className="activities_container">
          <a href="/home">Назад</a>
        </div>
        <div className="filter_users">
          <select placeholder="Отдел" onChange={() => changeDepartment()}>
            {renderOptions()}
          </select>
          <form onSubmit={() => filterUsers()}>
            <input placeholder="ФИО пользователя" />
            <button className="btn_blue" type="sumbit">
              Найти
            </button>
          </form>
        </div>
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

      {isModalDeleteOpen && (
        <Modal
          isOpen={isModalDeleteOpen}
          onClose={closeModalDelete}
          contentClassName="delete"
        >
          <div className="modalDelete">
            <p>
              Вы точно хотите удалить пользователя{" "}
              <b>
                {fullnameDeleteUserArray[0]}
                {fullnameDeleteUserArray[1]}
                {fullnameDeleteUserArray[2]}
              </b>
              ?
            </p>
            <div>
              <button className="btn_blue" onClick={() => deleteUser()}>
                Удалить
              </button>
              <button
                className="btn_darkGray"
                onClick={() => closeModalDelete()}
              >
                Отменить
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UserProfiles;
