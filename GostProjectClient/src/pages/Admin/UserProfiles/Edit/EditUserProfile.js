import { useEffect, useState } from "react";
import HeaderUser from "../../../../components/Header/HeaderUser";
import HeaderAdmin from "../../../../components/HeaderAdmin/HeaderAdmin";
import "./EditUserProfile.css";
import { useNavigate } from "react-router-dom";
import Modal from "../../../../components/Modal/Modal";
import { useParams } from "react-router-dom";
import axios from "axios";

const EditUserProfile = () => {
  const params = useParams(); // params.id
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [user, setUser] = useState({});

  useEffect(() => {
    axios({
      method: "post",
      url: `/api/User/GetUser/1}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((user) => {
        console.log("user.data", user.data);
        setUser(user.data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  const openModalCard = () => {
    setModalOpen(true);
    console.log(1213);
  };
  const closeModalCard = () => {
    setModalOpen(false);
  };

  const cancelHandler = () => {
    navigate("/home");
  };

  const submitHandler = (event) => {
    /*
    event.preventDefault();
    console.log(formData);
    console.log("ok");
    const formAddData = new FormData();
    formAddData.append("gostAddDto", JSON.stringify(formData));
    for (const key in formData) {
      formAddData.append(key, formData[key]);
    }

    console.log("formAddData", formAddData);
    console.log("TEST", formData.id);
    
      axios({
        method: "post",
        url: `/api/Gost/AddGost`,
        data: {
          designation: formData.designation,
          denomination: formData.denomination,
          oksCode: formData.oksCode,
          okpdCode: formData.okpdCode,
          developerId: localStorage.getItem("id"),
          content: formData.content,
          keywords: formData.keywords.split(","),
          keyphrases: formData.keyphrases.split(","),
          acceptanceLevel: Number(formData.acceptanceLevel),
          text: formData.text,
          normativeReferences: formData.normativeReferences,
        },
        headers: {
          "Content-Type": "application/json",
          //'Authorization': Bearer ${localStorage.getItem("token")}
        },
      })
        .then((gost) => {
          console.log(gost.data);
          setGost(gost.data);
          navigate("/home");
        })
        .catch((error) => {
          console.log(error);
        });
    */
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
      <div className="body_container">
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
              <input id="login" name="login" />
            </div>
            <div>
              <label htmlFor="department">Отдел</label>
              <input id="department" name="department" />
            </div>
            <div>
              <label htmlFor="role">Роль пользователя</label>
              <select id="role" name="role">
                <option value="admin">Администратор</option>
                <option value="user">Пользователь</option>
              </select>
            </div>
          </div>
          <div className="buttons">
            <button className="btn_blue" type="submit">
              Сохранить
            </button>
            <button
              className="btn_darkGray"
              type="button"
              onClick={openModalCard}
            >
              Отменить
            </button>
          </div>
        </form>
      </div>

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
            <button className="btn_blue" onClick={cancelHandler}>
              Покинуть
            </button>
            <button className="btn_gray" onClick={closeModalCard}>
              Вернуться
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default EditUserProfile;
