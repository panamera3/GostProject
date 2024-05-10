// styles
import "./HeaderAdmin.css";
// images
import user from "../../images/user.svg";
import notification from "../../images/notification.svg";
import notificationActive from "../../images/notificationActive.svg";
// libraries
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import axios from "axios";
import { searchDict } from "../constants/searchDict";

const HeaderAdmin = (props) => {
  const header = useRef();
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    pageSize: 10,
    offset: 0,
    total: 10,
  });
  const [filter, setFilter] = useState();
  const [search, setSearch] = useState();

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
    localStorage.setItem("token", "");
    localStorage.setItem("id", "");
    localStorage.setItem("role", "");
    navigate("/login");
  };

  const searchHandler = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const values = {};

    for (let [name, value] of formData) {
      if (value.trim() !== "") {
        values[name] = value.trim();
      }
    }
    console.log("values", values);
    setFilter(values);
    setSearch(true);
  };

  const searchGosts = () => {
    if (search) {
      axios({
        method: "post",
        url: `https://localhost:7243/api/Gost/GetGosts`,
        data: { userID: localStorage.getItem("id"), pagination, filter },
        headers: {
          "Content-Type": "application/json",
          //'Authorization': Bearer ${userToken}
        },
      })
        .then((gosts) => {
          if (gosts.data) {
            console.log("gosts.data", gosts.data.data);
            localStorage.setItem(
              "searchGosts",
              JSON.stringify(gosts.data.data)
            );
            setSearch(false);
            navigate("/search");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(searchGosts, [filter]);

  return (
    <>
      <div className="header" ref={header}>
        <div>
          <a href="/home">Все документы</a>
          {!props.user && <a href="/gostAdd">Создать документ</a>}
          <p onClick={() => openSearchModalCard()}>Поиск по документам</p>
          {!props.user && (
            <>
              <a href="/archive">Архив</a>
              <a href="/userProfiles">Пользователи</a>
              <a href="/activity">Активность</a>
            </>
          )}
        </div>
        <div id="header-images">
          {!props.user && (
            <>
              <img
                alt="Notifications"
                src={notification}
                onClick={() => navigate("/notifications")}
              />
              {/*
              
              <img
                alt="Notifications"
                src={notificationActive}
                onClick={() => openModalCard()}
              />
              
              */}
            </>
          )}
          <img alt="User" src={user} onClick={() => openModalCard()} />
        </div>
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModalCard}
          contentClassName="profile"
        >
          <div className="modalProfile">
            <a href="/myProfile">Мой профиль</a>
            <a href="/favourites">Избранное</a>
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
            <div>
              <div className="form_search_container">
                <div>
                  {Object.keys(searchDict)
                    .slice(0, Object.keys(searchDict).length / 2)
                    .map((key) => (
                      <div className="search_input_container" key={key}>
                        <label htmlFor={key}>{searchDict[key]}</label>
                        <input id={key} name={key} />
                      </div>
                    ))}
                </div>
                <div>
                  {Object.keys(searchDict)
                    .slice(Object.keys(searchDict).length / 2)
                    .map((key) => (
                      <div className="search_input_container" key={key}>
                        <label htmlFor={key}>{searchDict[key]}</label>
                        <input id={key} name={key} />
                      </div>
                    ))}
                </div>
              </div>
              <br />
              {/*
<div id="textSearchContainer">
<input
  id="textSearch"
  name="textSearch"
  placeholder="Поиск по тексту"
/>
</div>
*/}
            </div>
            <button className="btn_white" type="submit">
              Применить
            </button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default HeaderAdmin;
