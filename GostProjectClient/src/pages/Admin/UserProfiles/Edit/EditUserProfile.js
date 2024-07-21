import { useEffect, useState } from "react";
import HeaderUser from "../../../../components/Header/HeaderUser";
import HeaderAdmin from "../../../../components/HeaderAdmin/HeaderAdmin";
import "./EditUserProfile.css";
import { useNavigate } from "react-router-dom";
import Modal from "../../../../components/Modal/Modal";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserRole from "../../../../types/user/userRole";
import { BodyContainer, BtnBlue, BtnDarkGray, BtnGray } from "../../../../components/styles/styled_components";

const EditUserProfile = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [user, setUser] = useState({});

  useEffect(() => {
    axios({
      method: "get",
      url: `/api/User/GetUser/${params.id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((user) => {
        const fullname =
          `${user.data.lastName} ${user.data.firstName} ${user.data.patronymic}`.trim();
        const userWithFullname = { ...user.data, fullname };
        setUser(userWithFullname);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const openModalCard = () => {
    setModalOpen(true);
  };
  const closeModalCard = () => {
    setModalOpen(false);
  };

  const cancelHandler = () => {
    navigate("/userProfiles");
  };

  const submitHandler = (event) => {
    event.preventDefault();

    axios({
      method: "post",
      url: `/api/User/EditUser`,
      data: {
        id: params.id,
        fullname: formData.fullname,
        login: formData.login,
        department: formData.department,
        role: formData.role == 1 ? UserRole.Admin : UserRole.Standart,
        phoneNumber: formData.phoneNumber,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((user) => {
        toast.success("Пользователь был успешно отредактирован!");
        navigate("/userProfiles");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <>
      <HeaderAdmin />
      <BodyContainer>
        <div className="activities_container">
          <a href="/userProfiles">Назад</a>
        </div>

        <form onSubmit={submitHandler}>
          <div className="edit_profile_container">
            <div>
              <label htmlFor="fullname">ФИО пользователя</label>
              <input
                id="fullname"
                name="fullname"
                value={
                  formData["fullname"] != undefined
                    ? formData["fullname"]
                    : user["fullname"]
                }
                onChange={(e) => handleInputChange("fullname", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="login">Логин</label>
              <input
                id="login"
                name="login"
                value={
                  formData["login"] != undefined
                    ? formData["login"]
                    : user["login"]
                }
                onChange={(e) => handleInputChange("login", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="department">Отдел</label>
              <input
                id="department"
                name="department"
                value={
                  formData["department"] != undefined
                    ? formData["department"]
                    : user["department"]
                }
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
              />
            </div>
            {localStorage.getItem("id") == params.id && (
              <div>
                <label htmlFor="phoneNumber">Номер телефона</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={
                    formData["phoneNumber"] != undefined
                      ? formData["phoneNumber"]
                      : user["phoneNumber"]
                  }
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                />
              </div>
            )}
            {localStorage.getItem("id") !== params.id && (
              <div>
                <label htmlFor="role">Роль пользователя</label>
                <select
                  id="role"
                  name="role"
                  value={
                    formData["role"] !== undefined
                      ? formData["role"]
                      : user["role"] === UserRole.Admin
                      ? 1
                      : 2
                  }
                  onChange={(e) => handleInputChange("role", e.target.value)}
                >
                  <option value={1}>Администратор</option>
                  <option value={2}>Обычный пользователь</option>
                </select>
              </div>
            )}
          </div>
          <div className="buttons">
            <BtnBlue type="submit">
              Сохранить
            </BtnBlue>
            <BtnDarkGray
              type="button"
              onClick={openModalCard}
            >
              Отменить
            </BtnDarkGray>
          </div>
        </form>
      </BodyContainer>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModalCard}
          contentClassName="cancel"
          overlay
        >
          <div>
            <p>Внесенные изменения не будут сохранены.</p>
            <p>Вы точно хотите покинуть раздел редактирования пользователя?</p>
          </div>
          <div className="modalCancel_buttons">
            <BtnBlue onClick={cancelHandler}>
              Покинуть
            </BtnBlue>
            <BtnGray onClick={closeModalCard}>
              Вернуться
            </BtnGray>
          </div>
        </Modal>
      )}
    </>
  );
};

export default EditUserProfile;
