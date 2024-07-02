import axios from "axios";
import HeaderAdmin from "../../../components/HeaderAdmin/HeaderAdmin";
import "./UserProfiles.css";
import { useState, useEffect, useRef } from "react";
import UserRole from "../../../types/user/userRole";
import Modal from "../../../components/Modal/Modal";
import deleteImg from "../../../images/delete.svg";
import editImg from "../../../images/edit.svg";
import { useNavigate } from "react-router-dom";
import { translationRolesDict } from "../../../components/constants/translationRolesDict";

const UserProfiles = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(0);
  const [fullnameDeleteUserArray, setFullnameDeleteUserArray] = useState([]);
  const [uniqueDepartments, setUniqueDepartments] = useState([]);

  useEffect(() => {
    updateUsers();
    axios({
      method: "get",
      url: `/api/User/GetUniqueDepartments`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((departments) => {
        setUniqueDepartments(departments.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const updateUsers = () => {
    axios({
      method: "get",
      url: `/api/User/GetUsers`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((users) => {
        setUsers(users.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeDepartment = (selectedDepartment) => {
    axios({
      method: "post",
      url: `/api/User/FilterUsers`,
      data: {
        department: selectedDepartment,
      },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((filteredUsers) => {
        setUsers(filteredUsers.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderOptions = () => {
    if (users) {
      if (uniqueDepartments) {
        return [
          <option key="reset" value="" />,
          ...uniqueDepartments.map((department) => (
            <option key={department}>{department}</option>
          )),
        ];
      }
    }
  };

  const openModalDelete = (userId, fullnameArray) => {
    setIsModalDeleteOpen(true);
    setDeleteUserId(userId);
    setFullnameDeleteUserArray(fullnameArray);
  };
  const closeModalDelete = () => {
    setIsModalDeleteOpen(false);
  };

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
                translationRolesDict[
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

  const filterUsers = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const values = {};

    for (let [name, value] of formData) {
      if (value.trim() !== "") {
        values[name] = value.trim();
      }
    }

    axios({
      method: "post",
      url: `/api/User/FilterUsers`,
      data: {
        fullname: values.fullname ? values.fullname : "",
      },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((filteredUsers) => {
        setUsers(filteredUsers.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <HeaderAdmin />
      <div className="body_container">
        <div className="activities_container">
          <a href="/home">Назад</a>
        </div>
        <div className="filter_users">
          <select
            placeholder="Отдел"
            onChange={(e) => changeDepartment(e.target.value)}
          >
            {renderOptions()}
          </select>
          <form onSubmit={filterUsers}>
            <input placeholder="ФИО пользователя" name="fullname" />
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
          overlay
        >
          <div className="modalDelete">
            <p>
              Вы точно хотите удалить пользователя{" "}
              <b>
                {fullnameDeleteUserArray[0]} {fullnameDeleteUserArray[1]}{" "}
                {fullnameDeleteUserArray[2]}
              </b>
              ?
            </p>
            <div className="modalDelete_buttons_container">
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
