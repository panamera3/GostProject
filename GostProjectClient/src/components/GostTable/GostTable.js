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
} from "../styles/styled_components";
// import hintImg from "../../images/hint.svg";

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
          if (!gost.data.gost) {
            toast.error("ГОСТ не найден");
            setGostNotFound(true);
            setTimeout(() => {
              navigate("/home");
            }, 5000);
            return;
          }

          const gostKeywords = gost.data.keywords;
          const gostKeyphrases = gost.data.keyphrases;
          setGost(gost.data.gost);
          setKeywords(gostKeywords);
          setKeyphrases(gostKeyphrases);

          setFormData(() => ({
            keywords: gostKeywords
              .map((keyword) => keyword.name)
              .join(", ")
              .trim(),
            keyphrases: gostKeyphrases
              .map((keyphrase) => keyphrase.name)
              .join(", ")
              .trim(),
          }));

          setReplacedContainerVisibility(
            gost.data.gost.gostIdReplaced ? true : false
          );
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
          setSelectedItems(
            references.data.map((reference) => ({
              id: String(reference.referenceGostId),
            }))
          );
          if (references.data) {
            const referenceGostIds = references.data.map(
              (reference) => reference.referenceGostId
            );

            axios({
              method: "post",
              url: "/api/Gost/GetGostsRange",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
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
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((gostsNormativeReferences) => {
        setGostsNormativeReferences(gostsNormativeReferences.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
    return (
      <>
        {normativeReferences && normativeReferences.length > 0 ? (
          <ul>
            {normativeReferences.map((reference) => (
              <li key={reference.id}>
                <a href={`/gost/${reference.referenceGostId}`}>
                  {referenceGostNames[reference.referenceGostId] || ""}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет ссылок</p>
        )}
      </>
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
      console.log(gostsNormativeReferences);
      console.log(selectedItems);
      return (
        <>
          {selectedItems && selectedItems.length > 0 ? (
            <ul>
              {selectedItems.map((item) => (
                <li key={item.id}>
                  {
                    gostsNormativeReferences.find((gost) => gost.id == item.id)
                      ?.designation
                  }
                  <BtnDeleteNormativeReference
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Удалить
                  </BtnDeleteNormativeReference>
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
                  !selectedItems.some((selected) => selected.id == item.id)
              )
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.designation}
                </option>
              ))}
          </select>
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
                          className="hintForKeys"
                          title="Введите значения через запятую"
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
                          className="hintForKeys"
                          title="Введите значения через запятую"
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

    const normativeReferences = selectedItems.map((item) => item.id);

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
        method: "post",
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
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((gost) => {
          setGost(gost.data);
          console.log(id);
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
        <div className="no_gost_container">
          <p>Нет данных</p>
        </div>
      )}
      {!gostNotFound && (
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
