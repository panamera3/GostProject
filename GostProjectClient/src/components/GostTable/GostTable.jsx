import "./GostTable.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../Modal/Modal";
import { translationGostDict } from "../constants/translationGostDict";
import { actionStatusOptions } from "../constants/ActionStatusOptions";
import { acceptanceLevelOptions } from "../constants/AcceptanceLevelOptions";
import { toast } from "react-toastify";
import {
  BtnBlue,
  BtnDarkGray,
  BtnDeleteNormativeReference,
  BtnGray,
  NoDataContainer,
} from "../styles/styled_components";
import ReactSelect from "react-select";
import Table from "../Table/Table";

const GostTable = ({ id, view, edit, add }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(new FormData());
  const [formFileData, setFormFileData] = useState(new FormData());

  const [gost, setGost] = useState({});
  const [normativeReferences, setNormativeReferences] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [keyphrases, setKeyphrases] = useState([]);
  const [referenceGostNames, setReferenceGostNames] = useState({});
  const [gostsNormativeReferences, setGostsNormativeReferences] = useState([]);
  const [gostReplacedName, setGostReplacedName] = useState("");
  const [replacedContainerVisibility, setReplacedContainerVisibility] =
    useState(false);

  const [addedGostId, setAddedGostId] = useState(0);
  const [editedGostId, setEditedGostId] = useState(0);

  const [changedFileToGost, setChangedFileToGost] = useState(false);

  const [selectedFile, setSelectedFile] = useState("");

  const [gostFile, setGostFile] = useState("");

  const [selectedItems, setSelectedItems] = useState([]);
  const [normativeReferencesMode, setNormativeReferencesMode] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const newFormData = new FormData();
    newFormData.append("gostFile", file);

    setFormFileData(newFormData);
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const openModalCard = () => {
    setModalOpen(true);
  };
  const closeModalCard = () => {
    setModalOpen(false);
  };

  const [updateGostDates, setUpdateGostDates] = useState([]);

  const [gostNotFound, setGostNotFound] = useState(false);

  useEffect(() => {
    if (Object.keys(gost).length !== 0) {
      if (gost.gostIdReplaced != undefined) {
        axios({
          method: "get",
          url: `/api/Gost/GetGostName/${gost.gostIdReplaced}`,
        })
          .then((gostReplacedName) => {
            setGostReplacedName(gostReplacedName.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
    if (gost) {
      if (add || edit) {
        getDataForNormativeReferences();
      }
    }
  }, [gost]);

  useEffect(() => {
    if (add) {
      if (addedGostId) {
        if (selectedFile) {
          axios({
            method: "post",
            url: `/api/Gost/AddFileToGost?gostID=${addedGostId}`,
            data: formFileData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
            .then((file) => {
              setGostFile(file.data);
              toast.success("Файл был успешно добавлен к ГОСТу");
            })
            .catch((error) => {
              console.log(error);
            });
        }
        toast.success("ГОСТ был успешно добавлен");
        navigate(`/gost/${addedGostId}`);
      }
    }
  }, [addedGostId]);

  useEffect(() => {
    if (edit) {
      if (editedGostId) {
        if (selectedFile) {
          axios({
            method: "post",
            url: `/api/Gost/ChangeFileToGost?gostID=${editedGostId}`,
            data: formFileData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
            .then((file) => {
              setGostFile(file.data);
              setChangedFileToGost(true);
            })
            .catch((error) => {
              console.log(error);
              toast.error("Файл к ГОСТу не был заменён");
            });
        } else {
          toast.success("ГОСТ был успешно отредактирован");
          navigate(`/gost/${id}`);
        }
      }
    }
  }, [editedGostId]);

  useEffect(() => {
    if (changedFileToGost) {
      toast.success("Файл к ГОСТу был успешно заменён");
      navigate(`/gost/${id}`);
    }
  }, [changedFileToGost]);

  useEffect(() => {
    if (view || edit) {
      const fetchData = async () => {
        try {
          const updateDatesResponse = await axios.get(
            `/api/Gost/GetUpdateGostDates/${id}`
          );
          setUpdateGostDates(updateDatesResponse.data);

          const gostResponse = await axios.get(`/api/Gost/GetGost/${id}`);

          if (!gostResponse.data.gost) {
            toast.error("ГОСТ не найден");
            setGostNotFound(true);
            setTimeout(() => {
              navigate("/home");
            }, 5000);
            return;
          }

          const { gost, keywords, keyphrases, normativeReferences } =
            gostResponse.data;
          setGost(gost);
          setKeywords(keywords);
          setKeyphrases(keyphrases);
          setNormativeReferences(normativeReferences);

          setFormData({
            keywords: keywords
              .map((keyword) => keyword.name)
              .join(", ")
              .trim(),
            keyphrases: keyphrases
              .map((keyphrase) => keyphrase.name)
              .join(", ")
              .trim(),
          });

          setReplacedContainerVisibility(!!gost.gostIdReplaced);

          const selectedItems = normativeReferences.reduce(
            (items, reference) => {
              if (reference.referenceGostId !== null) {
                items.push({
                  id: String(reference.referenceGostId),
                  designation: reference.referenceGost?.designation || "",
                });
              } else {
                items.push({
                  id: null,
                  designation: reference.referenceGostDesignation,
                });
              }
              return items;
            },
            []
          );
          setSelectedItems(selectedItems);

          const referenceGostIds = normativeReferences
            .filter((reference) => reference.referenceGostId !== null)
            .map((reference) => reference.referenceGostId);

          if (referenceGostIds.length > 0) {
            const fetchedGostsResponse = await axios.post(
              "/api/Gost/GetGostsRange",
              {
                GostIDs: referenceGostIds,
              }
            );

            const newReferenceGostNames = {};
            fetchedGostsResponse.data.forEach((gost) => {
              newReferenceGostNames[gost.id] = gost.designation;
            });
            setReferenceGostNames(newReferenceGostNames);
          }

          const gostFileResponse = await axios.get(
            `/api/Gost/GetGostFile/${id}`
          );
          setGostFile(gostFileResponse.data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    }
  }, []);

  useEffect(() => {
    if (!view) {
      const handleBeforeUnload = (event) => {
        event.preventDefault();
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, []);

  const getDataForNormativeReferences = () => {
    var url = `/api/Gost/GetDataForNormativeReferences/?companyID=${localStorage.getItem(
      "workCompanyID"
    )}`;
    url += edit ? `&gostID=${gost.id}` : "";
    axios({
      method: "get",
      url: url,
    })
      .then((gostsNormativeReferences) => {
        setGostsNormativeReferences(gostsNormativeReferences.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [inputValue, setInputValue] = useState("");

  const handleNormativeReferenceChange = (selectedOption) => {
    if (selectedOption) {
      const newOption = {
        id: String(selectedOption.value),
        designation: selectedOption.label,
      };
      if (
        !selectedItems.some(
          (item) => item.designation === newOption.designation
        )
      ) {
        setSelectedItems((prevItems) => [...prevItems, newOption]);
      }

      setInputValue("");
    }
  };

  const normativeReferencesOptions = gostsNormativeReferences
    .filter(
      (item) =>
        !selectedItems.some(
          (selected) =>
            selected.id === item.id || selected.designation === item.designation
        )
    )
    .map((item) => ({
      value: item.id,
      label: item.designation,
    }));

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const matchingOption = normativeReferencesOptions.find(
        (option) =>
          option.label.toLowerCase() === inputValue.trim().toLowerCase()
      );

      if (matchingOption) {
        handleNormativeReferenceChange(matchingOption);
      } else if (
        inputValue.trim() &&
        !selectedItems.some((item) => item.designation === inputValue.trim())
      ) {
        setSelectedItems((prevItems) => [
          ...prevItems,
          {
            id: null,
            designation: inputValue.trim(),
          },
        ]);
      }

      setInputValue("");
    }
  };

  const handleRemoveItem = (identifier) => {
    setSelectedItems((prevItems) =>
      prevItems.filter(
        (item) => item.id !== identifier && item.designation !== identifier
      )
    );
  };

  const replacedVisibilityChange = (event) => {
    const selectedValue = event.target.value;
    setReplacedContainerVisibility(selectedValue === "2");
  };

  const [gostIdReplaced, setGostIdReplaced] = useState(-1);

  const handleReplacedChange = (event) => {
    setGostIdReplaced(event.target.value);
  };

  const getOptionLabel = (options, value) => {
    const selectedOption = options.find((option) => option.value === value);
    return selectedOption ? selectedOption.label : "";
  };

  const excluded_keys = [
    "developerUser",
    "developerId",
    "developerCompany",
    "id",
    "gostReplaced",
    "gostIdReplaced",
  ];

  const isUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch (error) {
      return false;
    }
  };

  const formatValue = (value) => {
    if (isUrl(value)) {
      return <a href={value}>{value}</a>;
    } else if (typeof value === "string") {
      return <pre>{value}</pre>;
    } else {
      return value;
    }
  };

  const getViewValue = (key, value) => {
    if (key === "normativeReferences") {
      return getNormativeReferencesValue(
        normativeReferences,
        referenceGostNames
      );
    }

    if (key === "keywords") {
      return getKeywordsValue(keywords);
    }

    if (key === "keyphrases") {
      return getKeyphrasesValue(keyphrases);
    }
    if (key === "gostReplacedWith") {
      return getGostReplacedWithValue(gost.gostIdReplaced, gostReplacedName);
    }
    if (key === "gostFile") {
      return getGostFilePath();
    }

    if (value) {
      if (value === true) {
        return "Да";
      } else if (key === "acceptanceLevel") {
        return getOptionLabel(acceptanceLevelOptions, value);
      } else if (key === "actionStatus") {
        return getOptionLabel(actionStatusOptions, value);
      } else if (value === 0) {
        return "0";
      } else {
        return value;
      }
    } else if (key == "requestsNumber") {
      return value + 1;
    } else {
      return "Нет";
    }
  };

  const getUpdateDate = (key, updateGostDates) =>
    updateGostDates &&
    updateGostDates.some(
      (item) => item.name.toLowerCase() === key.toLowerCase()
    )
      ? updateGostDates
          .find((item) => item.name.toLowerCase() === key.toLowerCase())
          .updateDate.split("T")[0]
      : "";

  const getNormativeReferencesValue = (
    normativeReferences,
    referenceGostNames
  ) => {
    if (!normativeReferences || normativeReferences.length === 0) {
      return <p>Нет ссылок</p>;
    }

    const renderReference = (reference) => {
      if (reference.referenceGostId) {
        return (
          <a href={`/gost/${reference.referenceGostId}`}>
            {referenceGostNames[reference.referenceGostId] || ""}
          </a>
        );
      }
      return (
        <p style={{ padding: 0 }}>
          {reference.referenceGostDesignation || "Нет обозначения"}
        </p>
      );
    };

    return (
      <ul>
        {normativeReferences.map((reference) => (
          <li key={reference.id}>{renderReference(reference)}</li>
        ))}
      </ul>
    );
  };

  const getKeywordsValue = (keywords) => {
    if (keywords && keywords.length > 0) {
      return (
        <ul>
          {keywords.map((keyword) => (
            <li key={keyword.id}>
              <p>{keyword.name}</p>
            </li>
          ))}
        </ul>
      );
    } else {
      return <p>Нет ключевых слов</p>;
    }
  };

  const getKeyphrasesValue = (keyphrases) => {
    if (keyphrases && keyphrases.length > 0) {
      return (
        <ul>
          {keyphrases.map((keyphrase) => (
            <li key={keyphrase.id}>
              <p>{keyphrase.name}</p>
            </li>
          ))}
        </ul>
      );
    } else {
      return <p>Нет ключевых фраз</p>;
    }
  };

  const getGostReplacedWithValue = (gostIdReplaced, gostReplacedName) => {
    if (gostIdReplaced !== null) {
      return (
        <p>
          Взамен{" "}
          <a href={`/gost/${gostIdReplaced}`} className="gostReplacedName">
            {gostReplacedName}
          </a>
        </p>
      );
    } else {
      return <p>Принят впервые</p>;
    }
  };

  const getGostFilePath = () => {
    if (gostFile) {
      const filePath = gostFile.path;
      const fileName = filePath.split("/").pop();
      return (
        <a href={`${filePath}`} className="gostFilePath">
          {fileName}
        </a>
      );
    } else {
      return <p>Нет</p>;
    }
  };

  const requiredFields = [
    "designation",
    "denomination",
    "oksCode",
    "okpdCode",
    "content",
    "keywords",
    "keyphrases",
    "acceptanceYear",
    "introdutionYear",
    "text",
    "acceptanceLevel",
    "actionStatus",
    "developerName",
  ];

  const changeNormativeReferencesForEdit = () => {
    setGost((prevData) => ({
      ...prevData,
      [normativeReferences]: gost.normativeReferences ? 2 : undefined,
    }));
  };

  /*
  const switchNormativeReferencesMode = () => {
    setNormativeReferencesMode(!normativeReferencesMode);
  };
  */

  const renderAddEditField = (key) => {
    const value = formData[key] !== undefined ? formData[key] : gost[key];

    if (key === "actionStatus") {
      return (
        <select
          className="gostInput"
          value={value}
          onChange={(e) => handleInputChange(key, e.target.value)}
        >
          <option value="">Выберите статус</option>
          {actionStatusOptions
            .filter((option) => option.label.toLowerCase() !== "заменён")
            .map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      );
    }

    if (key === "acceptanceLevel") {
      return (
        <select
          className="gostInput"
          value={value}
          onChange={(e) => handleInputChange(key, e.target.value)}
        >
          <option value="">Выберите уровень принятия</option>
          {acceptanceLevelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (key === "gostIdReplaced") {
      return (
        <>
          <select
            onChange={(event) => {
              replacedVisibilityChange(event);
              if (edit) changeNormativeReferencesForEdit();
            }}
            value={replacedContainerVisibility ? 2 : 1}
          >
            <option value={1}>Принят впервые</option>
            <option value={2}>Принят взамен</option>
          </select>
          {replacedContainerVisibility && (
            <select
              className="gostInput"
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
            >
              {gostsNormativeReferences.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.designation}
                </option>
              ))}
            </select>
          )}
        </>
      );
    }

    if (key === "normativeReferences") {
      return (
        <>
          {selectedItems && selectedItems.length > 0 ? (
            <ul>
              {selectedItems.map((item) => (
                <li key={item.id}>
                  {item.id ? (
                    <a href={`/gost/${item.id}`}>
                      {
                        gostsNormativeReferences.find(
                          (gost) => gost.id == item.id
                        )?.designation
                      }
                    </a>
                  ) : (
                    <span>{item.designation}</span>
                  )}
                  <BtnDeleteNormativeReference
                    onClick={() =>
                      handleRemoveItem(item.id ? item.id : item.designation)
                    }
                  >
                    Удалить
                  </BtnDeleteNormativeReference>
                </li>
              ))}
            </ul>
          ) : (
            <p>Нет ссылок</p>
          )}

          <ReactSelect
            options={normativeReferencesOptions}
            onChange={handleNormativeReferenceChange}
            onKeyDown={handleKeyDown}
            placeholder="Выберите или введите обозначение ГОСТа"
            styles={{
              container: (provided) => ({
                ...provided,
                marginRight: "1em",
              }),
              control: (provided) => ({
                ...provided,
                borderRadius: "12px",
                border: "1px solid #a8a8a8",
              }),
            }}
            onInputChange={(inputValue) => setInputValue(inputValue)}
            isClearable
            isSearchable
            noOptionsMessage={() =>
              "Нет доступных вариантов. Нажмите Enter, если необходимо добавить введённый Вами вариант."
            }
            onFocus={() => setInputValue("")}
            inputValue={inputValue}
          />

          {/*

{!normativeReferencesMode && (
            <select
              onChange={handleNormativeReferenceChange}
              style={{ marginRight: "1em" }}
            >
              <option value="">Выберите нормативную ссылку</option>
              {gostsNormativeReferences
                .filter(
                  (item) =>
                    !selectedItems.some(
                      (selected) =>
                        selected.id === item.id ||
                        selected.designation === item.designation
                    )
                )
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.designation}
                  </option>
                ))}
            </select>
          )}

          {normativeReferencesMode && (
            <input
              style={{ width: "70%", margin: 0, marginRight: "1em" }}
              onKeyDown={handleNormativeReferenceChange}
              placeholder="Введите обозначение ГОСТа и нажмите Enter"
            />
          )}

          <img
            // src={switchImg}
            alt="→"
            onClick={switchNormativeReferencesMode}
          />
  */}
        </>
      );
    }

    if (key === "content") {
      return (
        <textarea
          className="gostInputAdd"
          value={value}
          onChange={(e) => handleInputChange(key, e.target.value)}
        />
      );
    }

    return (
      <input
        className="gostInput"
        value={value}
        onChange={(e) => handleInputChange(key, e.target.value)}
      />
    );
  };

  const renderGostTable = () => {
    if (Object.keys(gost).length !== 0) {
      if (edit) {
        const editFields = [
          "designation",
          "denomination",
          "oksCode",
          "okpdCode",
          "acceptanceYear",
          "introdutionYear",
          "developerName",
          "content",
          "acceptanceLevel",
          "actionStatus",
          "changes",
          "amendments",
          "gostIdReplaced",
          "keywords",
          "keyphrases",
          "normativeReferences",
        ];

        return (
          <>
            {editFields.map((key, index) => (
              <tr key={index}>
                <td>
                  <label htmlFor={key}>
                    {translationGostDict[key]}
                    {requiredFields.includes(key) && (
                      <p className="requiredField">*</p>
                    )}
                    {key.toLowerCase().includes("key") && (
                      <>
                        <img
                          alt="?"
                          // src={hintImg}
                          className="hint"
                          title="Введите значения через запятую"
                        />
                      </>
                    )}
                    {/*
                    key == "normativeReferences" && (
                      <>
                        <img
                          alt="?"
                          // src={hintImg}
                          className="hint"
                          title="Для добавления ссылки на ГОСТ, которого нет в базе, нажмите кнопку для переключения режима"
                        />
                      </>
                    )
                      */}
                  </label>
                </td>
                <td>{renderAddEditField(key)}</td>
              </tr>
            ))}

            <tr>
              <td colSpan="2">
                <div className="file-input-container">
                  <input type="file" onChange={handleFileChange} />
                </div>
              </td>
            </tr>
          </>
        );
      }

      const viewFields = Object.keys(gost).concat(
        "normativeReferences",
        "keywords",
        "keyphrases",
        "gostReplacedWith",
        "gostFile"
      );

      return viewFields
        .filter((key) => !excluded_keys.includes(key))
        .map((key, index) => (
          <tr key={index}>
            <td>
              <label htmlFor={key}>{translationGostDict[key] || key}</label>
            </td>
            <td>{formatValue(getViewValue(key, gost[key]))}</td>
            <td>{getUpdateDate(key, updateGostDates)}</td>
          </tr>
        ));
    } else {
      if (add) {
        const addFields = [
          "designation",
          "denomination",
          "oksCode",
          "okpdCode",
          "acceptanceYear",
          "introdutionYear",
          "developerName",
          "acceptanceLevel",
          "actionStatus",
          "content",
          "keywords",
          "keyphrases",
          "text",
          "changes",
          "amendments",
          "normativeReferences",
          "gostIdReplaced",
        ];

        return (
          <>
            {addFields.map((key, index) => (
              <tr key={index}>
                <td>
                  <label htmlFor={key}>
                    {translationGostDict[key]}
                    {requiredFields.includes(key) && (
                      <p className="requiredField">*</p>
                    )}
                    {key.toLowerCase().includes("key") && (
                      <>
                        <img
                          alt="?"
                          // src={hintImg}
                          className="hint"
                          title="Введите значения через запятую"
                        />
                      </>
                    )}
                    {key == "normativeReferences" && (
                      <>
                        <img
                          alt="?"
                          // src={hintImg}
                          className="hint"
                          title="Для добавления ссылки на ГОСТ, которого нет в базе, нажмите кнопку для переключения режима"
                        />
                      </>
                    )}
                  </label>
                </td>
                <td>{renderAddEditField(key)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="2">
                <div className="file-input-container">
                  <input type="file" onChange={handleFileChange} />
                </div>
              </td>
            </tr>
          </>
        );
      }
      return Object.keys(translationGostDict).map((key) => (
        <tr key={key}>
          <td>
            <label htmlFor={key}>{translationGostDict[key]}</label>
          </td>
          <td>
            <input
              className="gostInput"
              onChange={(e) => handleInputChange(key, e.target.value)}
            />
          </td>
          <td />
        </tr>
      ));
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const formAddData = new FormData();
    formAddData.append("gostAddDto", JSON.stringify(formData));
    for (const key in formData) {
      formAddData.append(key, formData[key]);
    }

    const normativeReferences = selectedItems.map(
      (item) => item.id || item.designation
    );

    if (add) {
      const missingFields = requiredFields.filter(
        (field) => !formData[field] || formData[field] === ""
      );

      if (missingFields.length > 0) {
        toast.error("Заполните все обязательные поля (*)");
        return;
      }

      if (isNaN(formData.acceptanceYear) || isNaN(formData.introdutionYear)) {
        toast.error(
          `Поля "Год принятия" и "Год введения" должны содержать только числа`
        );
        return;
      }

      axios({
        method: "post",
        url: `/api/Gost/AddGost`,
        data: {
          ...formData,
          developerId: localStorage.getItem("workCompanyID"),
          keywords: formData.keywords.split(","),
          keyphrases: formData.keyphrases.split(","),
          acceptanceLevel: Number(formData.acceptanceLevel),
          actionStatus: Number(formData.actionStatus),
          acceptanceYear: Number(formData.acceptanceYear),
          introdutionYear: Number(formData.introdutionYear),
          gostIdReplaced: Number(formData.gostIdReplaced),
          normativeReferences,
        },
      }).then((gost) => {
        if (gostIdReplaced !== -1) {
          const replacedStatus = actionStatusOptions.find(
            (option) => option.label === "Заменён"
          );

          axios({
            method: "put",
            url: `/api/Gost/EditGost`,
            data: {
              id: gostIdReplaced,
              actionStatus: replacedStatus,
            },
          })
            .then((gost) => {})
            .catch((error) => {
              console.log(error);
            });
        }

        setAddedGostId(gost.data.id);
      });
    }
    if (edit) {
      const missingFields = requiredFields.filter(
        (field) => formData[field] === ""
      );

      if (missingFields.length > 0) {
        toast.error("Заполните все обязательные поля (*)");
        return;
      }

      if (formData.acceptanceYear) {
        if (isNaN(formData.acceptanceYear)) {
          toast.error(
            `Поля "Год принятия" и "Год введения" должны содержать только числа`
          );
          return;
        }
      }
      if (formData.introdutionYear) {
        if (isNaN(formData.introdutionYear)) {
          toast.error(
            `Поля "Год принятия" и "Год введения" должны содержать только числа`
          );
          return;
        }
      }

      const keywordsToCompare = keywords
        .map((keyword) => keyword.name)
        .join(", ")
        .trim();
      const keywordsData =
        keywordsToCompare !== formData.keywords?.trim()
          ? formData.keywords?.split(",").map((keyword) => keyword.trim())
          : undefined;

      const keyphrasesToCompare = keyphrases
        .map((keyphrase) => keyphrase.name)
        .join(", ")
        .trim();
      const keyphrasesData =
        keyphrasesToCompare !== formData.keyphrases?.trim()
          ? formData.keyphrases?.split(",").map((keyphrase) => keyphrase.trim())
          : undefined;

      axios({
        method: "put",
        url: `/api/Gost/EditGost`,
        data: {
          id,
          ...formData,
          normativeReferences,
          keywords: keywordsData,
          keyphrases: keyphrasesData,
          gostIdReplaced: replacedContainerVisibility
            ? formData.gostIdReplaced
            : 0,
        },
      })
        .then((gost) => {
          setGost(gost.data);
          setEditedGostId(id);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const cancelHandler = () => {
    navigate("/home");
  };

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <>
      {gostNotFound && (
        <NoDataContainer>
          <p>Нет данных</p>
        </NoDataContainer>
      )}
      {!gostNotFound && (
        <form onSubmit={submitHandler}>
          <Table
            className="gost_table"
            headers={[
              "Поле",
              "Значение",
              ...(add || edit ? [] : ["Дата последней актуализации"]),
            ]}
            renderBody={renderGostTable}
          />
          {!view && edit && (
            <>
              <BtnBlue type="submit">Сохранить</BtnBlue>
              <BtnDarkGray type="button" onClick={openModalCard}>
                Отменить
              </BtnDarkGray>
            </>
          )}
          {!view && add && (
            <>
              <BtnBlue type="submit">Добавить</BtnBlue>
              <BtnDarkGray type="button" onClick={openModalCard}>
                Отменить
              </BtnDarkGray>
            </>
          )}
        </form>
      )}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModalCard}
          contentClassName="cancel"
          overlay
        >
          <div>
            <p>Внесенные изменения не будут сохранены.</p>
            <p>Вы точно хотите покинуть раздел редактирования документа?</p>
          </div>
          <div className="modalCancel_buttons">
            <BtnBlue onClick={cancelHandler}>Покинуть</BtnBlue>
            <BtnGray onClick={closeModalCard}>Вернуться</BtnGray>
          </div>
        </Modal>
      )}
    </>
  );
};

export default GostTable;
