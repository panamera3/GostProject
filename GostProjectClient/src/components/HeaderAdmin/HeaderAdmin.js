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

  const searchHandler = () => {
    console.log(897);
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
        >
          <form onSubmit={searchHandler}>
            <div className="form_search_container">
              <div>
                <div>
                  <label for="">Обозначение стандарта</label>
                  <input id="" />
                </div>
                <div>
                  <label for="">Наименование стандарта</label>
                  <input id="" />
                </div>
                <div>
                  <label for="">Код ОКС</label>
                  <input id="" />
                </div>
                <div>
                  <label for="">Код ОКПД</label>
                  <input id="" />
                </div>
                <div>
                  <label for="">Разработчик</label>
                  <input id="" />
                </div>
                <div>
                  <label for="">Принят взамен</label>
                  <input id="" />
                </div>
                <div>
                  <label for="">Текст документа</label>
                  <input id="" />
                </div>
                <div>
                  <label for="">Поправки</label>
                  <input id="" />
                </div>
              </div>
              <div>
                <div>
                  <label for="">Нормативные ссылки</label>
                  <input id="" />
                </div>
                <div>
                  <label for="">Дата принятия</label>
                  <input id="" />
                </div>
                <div>
                  <label for="">Дата введение</label>
                  <input id="" />
                </div>
                <div>
                  <label for="">Дата актуализации описания</label>
                  <input id="" />
                </div>
                <div>
                  <label for="">Содержание</label>
                  <input id="" />
                </div>
                <div>
                  <label for="">Ключевые слова</label>
                  <input id="" />
                </div>
                <div>
                  <label for="">Ключевые фразы</label>
                  <input id="" />
                </div>
                <div>
                  <label for="">Уровень принятия</label>
                  <input id="" />
                </div>
              </div>
            </div>
            <button type="sumbit">Применить</button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default HeaderAdmin;
