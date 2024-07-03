import "./Search.css";
import { searchDict } from "../../components/constants/searchDict";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import HeaderUser from "../../components/Header/HeaderUser";
import Home from "../Home/Home";
import { acceptanceLevelOptions } from "../../components/constants/AcceptanceLevelOptions";
import { actionStatusOptions } from "../../components/constants/ActionStatusOptions";

const Search = () => {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    pageSize: 10,
    offset: 0,
    total: 0,
    currentPage: 1,
  });
  const [filter, setFilter] = useState([]);
  const [search, setSearch] = useState(false);
  const [textSearch, setTextSearch] = useState(false);
  const [afterTextSearch, setAfterTextSearch] = useState(false);

  const [requestedInsteadOptions, setRequestedInsteadOptions] = useState([]);

  useEffect(() => {
    fetchRequestedInsteadOptions();
  }, []);

  const fetchRequestedInsteadOptions = async () => {
    try {
      const response = await axios.get(
        "/api/Gost/GetDataForNormativeReferences"
      );
      setRequestedInsteadOptions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const searchGosts = () => {
    if (search) {
      axios({
        method: "post",
        url: `/api/Gost/GetGosts`,
        data: { companyID: localStorage.getItem("workCompanyID"), pagination, filter },
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

  useEffect(searchGosts, [filter, pagination.offset]);

  const searchHandler = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const values = {};

    for (let [name, value] of formData) {
      if (value.trim() !== "") {
        switch (name) {
          case "acceptanceLevel" || "actionStatus":
            values[name] = value ? parseInt(value) : null;
            break;
          default:
            values[name] = value.trim();
            break;
        }
      }
    }

    console.log(values);

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
        companyID: localStorage.getItem("workCompanyID"),
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

  const handleInputChange = (event, setFilter) => {
    const { name, value } = event.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value.trim(),
    }));
  };

  const renderSearchField = (key, filter, setFilter) => {
    switch (key) {
      case "acceptanceLevel":
        return (
          <select
            id={key}
            name={key}
            value={filter[key] || ""}
            onChange={(e) => handleInputChange(e, setFilter)}
          >
            <option value="">Выберите уровень принятия</option>
            {acceptanceLevelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "actionStatus":
        return (
          <select
            id={key}
            name={key}
            value={filter[key] || ""}
            onChange={(e) => handleInputChange(e, setFilter)}
          >
            <option value="">Выберите статус действия</option>
            {actionStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "gostIdReplaced":
        return (
          <select
            id={key}
            name={key}
            value={filter[key] || ""}
            onChange={(e) => handleInputChange(e, setFilter)}
          >
            <option value="">Выберите ГОСТ</option>
            {requestedInsteadOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.designation}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            id={key}
            name={key}
            value={filter[key] || ""}
            onChange={(e) => handleInputChange(e, setFilter)}
          />
        );
    }
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
                        {renderSearchField(key, filter, setFilter)}
                      </div>
                    ))}
                </div>
                <div>
                  {Object.keys(searchDict)
                    .slice(Object.keys(searchDict).length / 2)
                    .map((key) => (
                      <div className="search_input_container" key={key}>
                        <label htmlFor={key}>{searchDict[key]}</label>
                        {renderSearchField(key, filter, setFilter)}
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
                <Home searchGosts />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Search;
