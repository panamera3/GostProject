import "./Search.css";
import { searchDict } from "../../components/constants/searchDict";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import HeaderUser from "../../components/Header/HeaderUser";
import GostsTable from "../../components/GostsTable/GostsTable";

const Search = () => {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    pageSize: 10,
    offset: 0,
    total: 10,
  });
  const [filter, setFilter] = useState([]);
  const [search, setSearch] = useState(false);
  const [textSearch, setTextSearch] = useState(false);
  const [afterTextSearch, setAfterTextSearch] = useState(false);

  const searchGosts = () => {
    if (search) {
      axios({
        method: "post",
        url: `/api/Gost/GetGosts`,
        data: { userID: localStorage.getItem("id"), pagination, filter },
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((gosts) => {
          if (gosts.data) {
            localStorage.setItem(
              "searchGosts",
              JSON.stringify(gosts.data.data)
            );
            setSearch(false);
            navigate("/afterSearch");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(searchGosts, [filter]);

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
    setFilter(values);
    setSearch(true);
  };

  const submitTextSearchHandler = (event) => {
    event.preventDefault();

    const searchInFilePrompt = event.target.searchText.value;

    axios({
      method: "post",
      url: `/api/Gost/GetGosts`,
      data: {
        userID: localStorage.getItem("id"),
        pagination,
        searchInFilePrompt,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((gosts) => {
        if (gosts.data) {
          localStorage.setItem("searchGosts", JSON.stringify(gosts.data.data));
          setAfterTextSearch(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeToTextSearch = () => {
    setTextSearch(true);
  };

  const changeToFilterSearch = () => {
    setAfterTextSearch(false);
    setTextSearch(false);
  };

  return (
    <>
      {localStorage.getItem("role") == "Admin" ? (
        <HeaderAdmin />
      ) : (
        <HeaderUser />
      )}

      <div className="body_container">
        {!textSearch && (
          <>
            <a href="/home">Назад</a>
            <form onSubmit={searchHandler} className="modalSearchForm">
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

              <button className="btn_blue" type="submit">
                Применить
              </button>
              <button
                onClick={() => changeToTextSearch()}
                className="btn_darkGray"
              >
                К поиску по тексту
              </button>
            </form>
          </>
        )}

        {textSearch && (
          <>
            <p
              className="text_search_back"
              onClick={() => changeToFilterSearch()}
            >
              Назад
            </p>
            <form onSubmit={submitTextSearchHandler}>
              <div className="text_search_container">
                <input
                  id="text"
                  name="searchText"
                  placeholder="Введите текст"
                />
                <button className="btn_blue" type="submit">
                  Применить
                </button>
              </div>
            </form>
            {afterTextSearch && (
              <>
                <GostsTable searchGosts />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Search;
