// styles
import "./HeaderAdmin.css";
// images

// libraries
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "../Modal/Modal";

const HeaderAdmin = (props) => {
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);
  const openModalCard = () => {
    setModalOpen(true);
  };
  const closeModalCard = () => {
    setModalOpen(false);
  };

  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const openSearchModalCard = () => {
    setSearchModalOpen(true);
  };
  const closeSearchModalCard = () => {
    setSearchModalOpen(false);
  };

  const exitHandler = () => {
    console.log(123234);
  };

  //import UserIcon from "./user.svg"
  //src={UserIcon}

  return (
    <>
      <div className="header">
        <div>
          <a href="/gostAdd" className={props.user ? "user" : ""}>
            Создать документ
          </a>
          <p onClick={() => openSearchModalCard()}>Поиск по документам</p>
          <a href="/" className={props.user ? "user" : ""}>
            Архив
          </a>
          <a href="/userProfiles" className={props.user ? "user" : ""}>
            Пользователи
          </a>
        </div>
        <div>
          <img alt="User" onClick={() => openModalCard()} />
        </div>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModalCard}>
          <div className="modalProfile">
            <a href="/">Мой профиль</a>
            <a href="/userProfiles">Список профилей</a>
            <p onClick={exitHandler}>Выход</p>
          </div>
        </Modal>
      )}
      {isSearchModalOpen && (
        <Modal
          isOpen={isSearchModalOpen}
          onClose={closeSearchModalCard}
          overlay
        ></Modal>
      )}
    </>
  );
};

export default HeaderAdmin;
