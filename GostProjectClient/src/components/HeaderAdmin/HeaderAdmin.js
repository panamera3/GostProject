// styles
import "./HeaderAdmin.css";
// images

// libraries
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import Modal from "../Modal/Modal";

const HeaderAdmin = (props) => {
  const header = useRef();
  const navigate = useNavigate();

  const openModal = () => {
    const header = document.querySelector(".header");
    const headerHeight = header.offsetHeight;
    const bodyContainer = document.querySelector(".main_modal");
    bodyContainer.style.paddingTop = `${headerHeight}px`;
  };

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

  useEffect(() => {
    if (isModalOpen || isSearchModalOpen) {
      openModal();
    }
  }, [isModalOpen, isSearchModalOpen]);

  const exitHandler = () => {
    console.log(123234);
    navigate("/login");
  };

  const searchHandler = () => {
    console.log(897);
  };

  //import UserIcon from "./user.svg"
  //src={UserIcon}

  return (
    <>
      <div className="header" ref={header}>
        <div>
          {!props.user && <a href="/gostAdd">Создать документ</a>}
          <p onClick={() => openSearchModalCard()}>Поиск по документам</p>
          {!props.user && (
            <>
              <a href="/">Архив</a>
              <a href="/userProfiles">Пользователи</a>
            </>
          )}
        </div>
        <div>
          <img alt="User" onClick={() => openModalCard()} />
        </div>
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModalCard}
          contentClassName="profile"
        >
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
          contentClassName="search"
        >
          <form onSubmit={searchHandler} className="modalSearchForm">
            <div className="form_search_container">
              <div>
                <div className="search_input_container">
                  <label for="">Обозначение стандарта</label>
                  <input id="" />
                </div>
                <div className="search_input_container">
                  <label for="">Наименование стандарта</label>
                  <input id="" />
                </div>
                <div className="search_input_container">
                  <label for="">Код ОКС</label>
                  <input id="" />
                </div>
                <div className="search_input_container">
                  <label for="">Код ОКПД</label>
                  <input id="" />
                </div>
                <div className="search_input_container">
                  <label for="">Разработчик</label>
                  <input id="" />
                </div>
                <div className="search_input_container">
                  <label for="">Принят взамен</label>
                  <input id="" />
                </div>
                <div className="search_input_container">
                  <label for="">Текст документа</label>
                  <input id="" />
                </div>
                <div className="search_input_container">
                  <label for="">Поправки</label>
                  <input id="" />
                </div>
              </div>
              <div>
                <div className="search_input_container">
                  <label for="">Нормативные ссылки</label>
                  <input id="" />
                </div>
                <div className="search_input_container">
                  <label for="">Дата принятия</label>
                  <input id="" />
                </div>
                <div className="search_input_container">
                  <label for="">Дата введение</label>
                  <input id="" />
                </div>
                <div className="search_input_container">
                  <label for="">Дата актуализации описания</label>
                  <input id="" />
                </div>
                <div className="search_input_container">
                  <label for="">Содержание</label>
                  <input id="" />
                </div>
                <div className="search_input_container">
                  <label for="">Ключевые слова</label>
                  <input id="" />
                </div>
                <div className="search_input_container">
                  <label for="">Ключевые фразы</label>
                  <input id="" />
                </div>
                <div className="search_input_container">
                  <label for="">Уровень принятия</label>
                  <input id="" />
                </div>
              </div>
            </div>
            <button type="submit">Применить</button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default HeaderAdmin;
