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
import GostsTable from "../../components/GostsTable/GostsTable";

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

  const [uniqueKeywords, setUniqueKeywords] = useState([]);
  const [uniqueKeyphrases, setUniqueKeyphrases] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedKeyphrases, setSelectedKeyphrases] = useState([]);

  const [gostsTableSearchGosts, setGostsTableSearchGosts] = useState(1);
  const switchGostsTableSearchGostsState = () => {
    if (gostsTableSearchGosts == 1) setGostsTableSearchGosts(2);
    else setGostsTableSearchGosts(1);
  };

  useEffect(() => {
    fetchRequestedInsteadOptions();
    fetchUniqueKeywords();
    fetchUniqueKeyphrases();
  }, []);

  const fetchUniqueKeywords = async () => {
    try {
      const response = await axios.get(
        `/api/Keys/GetUniqueKeywords/${localStorage.getItem("workCompanyID")}`
      );
      setUniqueKeywords(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUniqueKeyphrases = async () => {
    try {
      const response = await axios.get(
        `/api/Keys/GetUniqueKeyphrases/${localStorage.getItem("workCompanyID")}`
      );
      setUniqueKeyphrases(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectKeyword = (event) => {
    const selectedKeywordId = parseInt(event.target.value);
    if (selectedKeywordId) {
      const selectedKeyword = uniqueKeywords.find(
        (kw) => kw.id === selectedKeywordId
      );
      setSelectedKeywords([...selectedKeywords, selectedKeyword]);
      event.target.value = "";
    }
  };

  const handleRemoveKeyword = (id) => {
    setSelectedKeywords(
      selectedKeywords.filter((keyword) => keyword.id !== id)
    );
  };

  const handleSelectKeyphrase = (event) => {
    const selectedKeyphraseId = parseInt(event.target.value);
    if (selectedKeyphraseId) {
      const selectedKeyphrase = uniqueKeyphrases.find(
        (kp) => kp.id === selectedKeyphraseId
      );
      setSelectedKeyphrases([...selectedKeyphrases, selectedKeyphrase]);
      event.target.value = "";
    }
  };

  const handleRemoveKeyphrase = (id) => {
    setSelectedKeyphrases(
      selectedKeyphrases.filter((keyphrase) => keyphrase.id !== id)
    );
  };

  const fetchRequestedInsteadOptions = async () => {
    try {
      const response = await axios.get(
        `/api/Gost/GetDataForNormativeReferences/${localStorage.getItem(
          "workCompanyID"
        )}`
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
        data: {
          companyID: localStorage.getItem("workCompanyID"),
          pagination,
          filter,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((gosts) => {
          localStorage.setItem("searchGosts", JSON.stringify(gosts.data.data));
          setSearch(false);
          navigate("/afterSearch");
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

    if (selectedKeywords.length > 0) {
      values["KeywordsIds"] = selectedKeywords.map((kw) => kw.id);
    }
    if (selectedKeyphrases.length > 0) {
      values["KeyphrasesIds"] = selectedKeyphrases.map((kw) => kw.id);
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
        companyID: localStorage.getItem("workCompanyID"),
        pagination,
        searchInFilePrompt,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((gosts) => {
        localStorage.setItem("searchGosts", JSON.stringify(gosts.data.data));
        setAfterTextSearch(true);
        switchGostsTableSearchGostsState();
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

  const filteredSearchDict = Object.keys(searchDict)
    .filter((key) => key !== "keywords" && key !== "keyphrases")
    .reduce((obj, key) => {
      obj[key] = searchDict[key];
      return obj;
    }, {});

  const halfLength = Math.ceil(Object.keys(filteredSearchDict).length / 2);

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
                <div className="form_search_container_without_keys">
                  <div>
                    {Object.keys(filteredSearchDict)
                      .slice(0, halfLength)
                      .map((key) => (
                        <div className="search_input_container" key={key}>
                          <label htmlFor={key}>{filteredSearchDict[key]}</label>
                          {renderSearchField(key, filter, setFilter)}
                        </div>
                      ))}
                  </div>
                  <div>
                    {Object.keys(filteredSearchDict)
                      .slice(halfLength)
                      .map((key) => (
                        <div className="search_input_container" key={key}>
                          <label htmlFor={key}>{filteredSearchDict[key]}</label>
                          {renderSearchField(key, filter, setFilter)}
                        </div>
                      ))}
                  </div>
                </div>

                <div className="search_input_container_key">
                  <label htmlFor="keywords">Ключевые слова</label>
                  <div>
                    {selectedKeywords && selectedKeywords.length > 0 ? (
                      <ul>
                        {selectedKeywords.map((keyword) => (
                          <li key={keyword.id}>
                            {keyword.name}
                            <button
                              className="delete_keys_button"
                              onClick={() => handleRemoveKeyword(keyword.id)}
                            >
                              Удалить
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Нет ключевых слов</p>
                    )}

                    <select onChange={handleSelectKeyword}>
                      <option value="">Выберите ключевое слово</option>
                      {uniqueKeywords
                        .filter(
                          (keyword) =>
                            !selectedKeywords.some(
                              (selected) => selected.id === keyword.id
                            )
                        )
                        .map((keyword) => (
                          <option key={keyword.id} value={keyword.id}>
                            {keyword.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="search_input_container_key">
                  <label htmlFor="keyphrases">Ключевые фразы</label>
                  <div>
                    {selectedKeyphrases && selectedKeyphrases.length > 0 ? (
                      <ul>
                        {selectedKeyphrases.map((keyphrase) => (
                          <li key={keyphrase.id}>
                            {keyphrase.name}
                            <button
                              className="delete_keys_button"
                              onClick={() =>
                                handleRemoveKeyphrase(keyphrase.id)
                              }
                            >
                              Удалить
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Нет ключевых фраз</p>
                    )}

                    <select onChange={handleSelectKeyphrase}>
                      <option value="">Выберите ключевую фразу</option>
                      {uniqueKeyphrases
                        .filter(
                          (keyphrase) =>
                            !selectedKeyphrases.some(
                              (selected) => selected.id === keyphrase.id
                            )
                        )
                        .map((keyphrase) => (
                          <option key={keyphrase.id} value={keyphrase.id}>
                            {keyphrase.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <button className="btn_blue" type="submit">
                Применить
              </button>
              <button
                onClick={() => changeToTextSearch()}
                className="btn_darkGray"
              >
                К поиску по тексту в документах
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
                <GostsTable searchGosts={gostsTableSearchGosts} />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Search;
