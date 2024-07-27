import axios from "axios";
import HeaderAdmin from "../../../components/HeaderAdmin/HeaderAdmin";
import "./UserProfiles.css";
import { useState, useEffect } from "react";
import UserRole from "../../../types/user/userRole";
import Modal from "../../../components/Modal/Modal";
import { useNavigate } from "react-router-dom";
import { translationRolesDict } from "../../../components/constants/translationRolesDict";
import { toast } from "react-toastify";
import {
  BodyContainer,
  BtnBlue,
  BtnDarkGray,
} from "../../../components/styles/styled_components";
import { deleteIcon, editIcon } from "../../../assets/images";
import BackLink from "../../../components/BackLink/BackLink";
import Table from "../../../components/Table/Table";

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
    })
      .then((users) => {
        setUsers(users.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderOptions = () => {
    if (users) {
      if (uniqueDepartments) {
        return [
          <option key="reset" value="">
            Выберите отдел
          </option>,
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
    })
      .then(() => {
        closeModalDelete();
        updateUsers();
        axios({
          method: "post",
          url: `/api/Auth/UpdateCompanyCode`,
        })
          .then(() => {
            toast.warning("Внимание! Код приглашения в компанию был обновлён.");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderUsers = () => {
    if (users) {
      return users.map((user, index) => (
        <tr key={user.id}>
          <td>
            <p>{index + 1}</p>
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
              src={editIcon}
              alt="редактировать"
              onClick={() => {
                navigate(`/editUser/${user.id}`);
              }}
            />
          </td>
          <td>
            {user.id != localStorage.getItem("id") && (
              <img
                src={deleteIcon}
                alt="удалить"
                onClick={() =>
                  openModalDelete(user.id, [
                    user.lastName,
                    user.firstName,
                    user.patronymic,
                  ])
                }
              />
            )}
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
        department: values.department ? values.department : "",
        fullname: values.fullname ? values.fullname : "",
      },
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
      <BodyContainer>
        <div className="activities_container">
          <BackLink />
        </div>
        <form onSubmit={filterUsers} className="filter_users_form">
          <div className="filter_users">
            <select placeholder="Отдел" name="department">
              {renderOptions()}
            </select>
            <input placeholder="ФИО пользователя" name="fullname" />
            <BtnBlue type="sumbit">Найти</BtnBlue>
          </div>
        </form>
        <Table
          className="user_profiles_table"
          headers={["№", "Отдел", "Роль", "ФИО пользователя", "", ""]}
          renderBody={renderUsers}
        />
      </BodyContainer>

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
              <BtnBlue onClick={() => deleteUser()}>Удалить</BtnBlue>
              <BtnDarkGray onClick={() => closeModalDelete()}>
                Отменить
              </BtnDarkGray>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UserProfiles;
