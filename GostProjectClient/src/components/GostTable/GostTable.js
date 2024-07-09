import "./GostTable.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Modal from "../Modal/Modal";
import { translationGostDict } from "../constants/translationGostDict";
import { actionStatusOptions } from "../constants/ActionStatusOptions";
import { acceptanceLevelOptions } from "../constants/AcceptanceLevelOptions";
import { toast } from "react-toastify";

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

  const [selectedFile, setSelectedFile] = useState("");

  const [gostFile, setGostFile] = useState("");

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

  useEffect(() => {
    if (Object.keys(gost).length !== 0) {
      if (gost.gostIdReplaced != undefined) {
        axios({
          method: "get",
          url: `/api/Gost/GetGostName/${gost.gostIdReplaced}`,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((gostReplacedName) => {
            setGostReplacedName(gostReplacedName.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, [gost]);

  useEffect(() => {
    if (add) {
      if (addedGostId) {
        if (selectedFile) {
          console.log("selectedFile", selectedFile);
          for (let [key, value] of formFileData.entries()) {
            console.log(`${key}:`, value);
          }

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
              toast.success("ГОСТ был успешно добавлен");
              navigate("/home");
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          toast.success("ГОСТ был успешно добавлен");
          navigate("/home");
        }
      }
    }
  }, [addedGostId]);

  useEffect(() => {
    if (view || edit) {
      axios({
        method: "get",
        url: `/api/Gost/GetUpdateGostDates/${id}`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((gosts) => {
          setUpdateGostDates(gosts.data);
        })
        .catch((error) => {
          console.log(error);
        });

      axios({
        method: "get",
        url: `/api/Gost/GetGost/${id}`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((gost) => {
          setGost(gost.data.gost);

          setKeywords(gost.data.keywords);
          setKeyphrases(gost.data.keyphrases);
        })
        .catch((error) => {
          console.log(error);
        });

      axios({
        method: "get",
        url: `/api/Gost/GetNormativeReferences/${id}`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((references) => {
          setNormativeReferences(references.data);
        })
        .catch((error) => {
          console.log(error);
        });

      axios({
        method: "get",
        url: `/api/Gost/GetGostFile/${id}`,
      })
        .then((gostFile) => {
          setGostFile(gostFile.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (add) {
      axios({
        method: "get",
        url: `/api/Gost/GetDataForNormativeReferences`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((gostsNormativeReferences) => {
          setGostsNormativeReferences(gostsNormativeReferences.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    if (normativeReferences) {
      const referenceGostIds = normativeReferences.map(
        (reference) => reference.referenceGostId
      );
      axios({
        method: "post",
        url: "/api/Gost/GetGostsRange",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: { GostIDs: referenceGostIds },
      })
        .then((response) => {
          const fetchedGosts = response.data;
          const newReferenceGostNames = {};
          fetchedGosts.forEach((gost) => {
            newReferenceGostNames[gost.id] = gost.designation;
          });
          setReferenceGostNames(newReferenceGostNames);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [normativeReferences]);

  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectChange = (event) => {
    const selectedOption = {
      id: event.target.value,
      designation: event.target.options[event.target.selectedIndex].text,
    };
    if (!selectedItems.some((item) => item.id === selectedOption.id)) {
      setSelectedItems((prevItems) => [...prevItems, selectedOption]);
    }
  };

  const handleRemoveItem = (id) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
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
    "normativeReferences",
    "developerId",
    "developerCompany",
    "id",
    "gostReplaced",
    "gostIdReplaced",
  ];
  const getViewValue = (key, value) => {
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
    } else if (key == "requestsNumber" && value == 0) {
      return "0";
    } else {
      return "Нет";
    }
  };

  const getEditValue = (key, value) => (
    <input
      className="gostInput"
      placeholder={translationGostDict[key] || key}
      value={value}
      onChange={(e) => handleInputChange(key, e.target.value)}
    />
  );

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
    view,
    normativeReferences,
    referenceGostNames
  ) => {
    if (view) {
      if (normativeReferences && normativeReferences.length > 0) {
        return (
          <ul>
            {normativeReferences.map((reference) => (
              <li key={reference.id}>
                <a href={`/gost/${reference.referenceGostId}`}>
                  {referenceGostNames[reference.referenceGostId] || ""}
                </a>
              </li>
            ))}
          </ul>
        );
      } else {
        return <p>Нет ссылок</p>;
      }
    } else {
      return (
        <ul>
          {normativeReferences.map((reference) => (
            <li key={reference.id}>
              <input
                type="text"
                value={referenceGostNames[reference.referenceGostId] || ""}
                onChange={(e) =>
                  handleInputChange("normativeReferences", e.target.value)
                }
              />
            </li>
          ))}
        </ul>
      );
    }
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

  const requiredAddFields = [
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
          "gostIdReplaced", // остановка
        ];

        return (
          <>
            {editFields.map((key, index) => (
              <tr key={index}>
                <td>
                  <label htmlFor={key}>{translationGostDict[key]}</label>
                </td>
                <td>
                  {key === "actionStatus" ? (
                    <select
                      className="gostInput"
                      value={formData.actionStatus || gost.actionStatus}
                      onChange={(e) =>
                        handleInputChange("actionStatus", e.target.value)
                      }
                    >
                      <option value="">Выберите статус</option>
                      {actionStatusOptions
                        .filter(
                          (option) => option.label.toLowerCase() != "заменён"
                        )
                        .map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </select>
                  ) : key === "acceptanceLevel" ? (
                    <select
                      className="gostInput"
                      value={formData.acceptanceLevel || gost.acceptanceLevel}
                      onChange={(e) =>
                        handleInputChange("acceptanceLevel", e.target.value)
                      }
                    >
                      <option value="">Выберите уровень принятия</option>
                      {acceptanceLevelOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="gostInput"
                      value={
                        formData[key] !== undefined ? formData[key] : gost[key]
                      }
                      onChange={(e) => handleInputChange(key, e.target.value)}
                    />
                  )}
                </td>
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
      return Object.keys(gost)
        .filter((key) => !excluded_keys.includes(key))
        .map((key) => ({
          key,
          label: translationGostDict[key] || key,
          value: view
            ? getViewValue(key, gost[key])
            : getEditValue(key, gost[key]),
          updateDate: getUpdateDate(key, updateGostDates),
        }))
        .concat([
          {
            key: "normativeReferences",
            label: "Нормативные ссылки",
            value: getNormativeReferencesValue(
              view,
              normativeReferences,
              referenceGostNames
            ),
          },
          {
            key: "keywords",
            label: "Ключевые слова",
            value: getKeywordsValue(keywords),
          },
          {
            key: "keyphrases",
            label: "Ключевые фразы",
            value: getKeyphrasesValue(keyphrases),
          },
          {
            key: "gostReplacedWith",
            label: "Принят взамен",
            value: getGostReplacedWithValue(
              gost.gostIdReplaced,
              gostReplacedName
            ),
          },
          {
            key: "gostFile",
            label: "Файл",
            value: getGostFilePath(),
          },
        ])
        .map(({ key, label, value, updateDate }) => (
          <tr key={key}>
            <td>
              <label htmlFor={key}>{label}</label>
            </td>
            <td>{value}</td>
            <td>{updateDate}</td>
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
        ];

        return (
          <>
            {addFields.map((key, index) => (
              <tr key={index}>
                <td>
                  <label htmlFor={key}>
                    {translationGostDict[key]}
                    <p className="requiredAddField">
                      {requiredAddFields.includes(key) && "*"}
                    </p>
                  </label>
                </td>
                <td>
                  {key === "actionStatus" ? (
                    <select
                      className="gostInputAdd"
                      value={formData.actionStatus}
                      onChange={(e) =>
                        handleInputChange("actionStatus", e.target.value)
                      }
                    >
                      <option value="">Выберите статус</option>
                      {actionStatusOptions
                        .filter(
                          (option) => option.label.toLowerCase() != "заменён"
                        )
                        .map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </select>
                  ) : key === "acceptanceLevel" ? (
                    <select
                      className="gostInputAdd"
                      value={formData.acceptanceLevel}
                      onChange={(e) =>
                        handleInputChange("acceptanceLevel", e.target.value)
                      }
                    >
                      <option value="">Выберите уровень принятия</option>
                      {acceptanceLevelOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="gostInputAdd"
                      value={formData[key]}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                    />
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <label>Нормативные ссылки</label>
              </td>
              <td>
                {selectedItems && selectedItems.length > 0 ? (
                  <ul>
                    {selectedItems.map((item) => (
                      <li key={item.id}>
                        {item.designation}
                        <button
                          className="delete_normative_reference_button btn_blue"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Удалить
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Нет ссылок</p>
                )}

                <select onChange={handleSelectChange}>
                  <option value="">Выберите нормативную ссылку</option>
                  {gostsNormativeReferences
                    .filter(
                      (item) =>
                        !selectedItems.some(
                          (selected) => selected.id === item.id
                        )
                    )
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.designation}
                      </option>
                    ))}
                </select>
              </td>
            </tr>

            <tr>
              <td>
                <label>Принят взамен</label>
              </td>
              <td>
                <select onChange={replacedVisibilityChange}>
                  <option value={1}>Принят впервые</option>
                  <option value={2}>Принят взамен</option>
                </select>
                {replacedContainerVisibility && (
                  <>
                    <select onChange={handleReplacedChange}>
                      {gostsNormativeReferences.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.designation}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </td>
            </tr>
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

    // formData.append("file", selectedFile);

    const normativeReferencesAdd = selectedItems.map((item) => item.id);

    if (add) {
      const missingFields = requiredAddFields.filter(
        (field) => !formData[field] || formData[field] === ""
      );

      if (missingFields.length > 0) {
        toast.error("Заполните все обязательные поля (*)");
        return;
      }

      axios({
        method: "post",
        url: `/api/Gost/AddGost`,
        data: {
          designation: formData.designation,
          denomination: formData.denomination,
          oksCode: formData.oksCode,
          okpdCode: formData.okpdCode,
          developerId: localStorage.getItem("workCompanyID"),
          content: formData.content,
          keywords: formData.keywords.split(","),
          keyphrases: formData.keyphrases.split(","),
          acceptanceLevel: Number(formData.acceptanceLevel),
          text: formData.text,
          actionStatus: Number(formData.actionStatus),
          normativeReferences: normativeReferencesAdd,
          acceptanceYear: Number(formData.acceptanceYear),
          developerName: formData.developerName,
          introdutionYear: Number(formData.introdutionYear),
          ...(gostIdReplaced !== -1 && {
            gostIdReplaced: Number(gostIdReplaced),
          }),
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then((gost) => {
        if (gostIdReplaced !== -1) {
          const replacedStatus = actionStatusOptions.find(
            (option) => option.label === "Заменён"
          );

          axios({
            method: "post",
            url: `/api/Gost/EditGost`,
            data: {
              id: gostIdReplaced,
              actionStatus: replacedStatus,
            },
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((gost) => {
              console.log(gost.data);
            })
            .catch((error) => {
              console.log(error);
            });
        }

        setAddedGostId(gost.data.id);
      });
    }
    if (edit) {
      axios({
        method: "post",
        url: `/api/Gost/EditGost`,
        data: {
          id: id,
          designation: formData.designation,
          denomination: formData.denomination,
          oksCode: formData.oksCode,
          okpdCode: formData.okpdCode,
          acceptanceYear: formData.acceptanceYear,
          introdutionYear: formData.introdutionYear,
          developerName: formData.developerName,
          content: formData.content,
          acceptanceLevel: formData.acceptanceLevel,
          actionStatus: formData.actionStatus,
          changes: formData.changes,
          amendments: formData.amendments,
          keywords: formData.keywords?.split(","),
          keyphrases: formData.keyphrases?.split(","),
          // добавить replacedGostId
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((gost) => {
          setGost(gost.data);
          toast.success("ГОСТ был успешно отредактирован");
          navigate(`/gost/${id}`);
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
      <form onSubmit={submitHandler}>
        <table className="gost_table">
          <thead>
            <tr>
              <th scope="col">Поле</th>
              <th scope="col">Значение</th>
              {!add && !edit && (
                <th scope="col">Дата последней актуализации</th>
              )}
            </tr>
          </thead>
          <tbody>{renderGostTable()}</tbody>
        </table>
        {!view && edit && (
          <>
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
          </>
        )}
        {!view && add && (
          <>
            <button className="btn_blue" type="submit">
              Добавить
            </button>
            <button
              className="btn_darkGray"
              type="button"
              onClick={openModalCard}
            >
              Отменить
            </button>
          </>
        )}
      </form>
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

export default GostTable;
