import "./GostTable.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Modal from "../Modal/Modal";
import { translationGostDict } from "../constants/translationGostDict";
import { actionStatusOptions } from "../constants/ActionStatusOptions";
import { acceptanceLevelOptions } from "../constants/AcceptanceLevelOptions";

const GostTable = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [gost, setGost] = useState({});
  const [normativeReferences, setNormativeReferences] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [keyphrases, setKeyphrases] = useState([]);
  const [referenceGostNames, setReferenceGostNames] = useState({});
  const [gostsNormativeReferences, setGostsNormativeReferences] = useState([]);
  const [gostReplacedName, setGostReplacedName] = useState("");
  const [replacedContainerVisibility, setReplacedContainerVisibility] =
    useState(false);

  // fdsfjkl

  const [selectedFile, setSelectedFile] = useState("");
  const selectedFile2Ref = useRef("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // fsdhjkdsf

  const [isModalOpen, setModalOpen] = useState(false);
  const openModalCard = () => {
    setModalOpen(true);
  };
  const closeModalCard = () => {
    setModalOpen(false);
  };

  const [updateGostDates, setUpdateGostDates] = useState([]);

  useEffect(() => {
    if (gost !== undefined) {
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
    axios({
      method: "get",
      url: `/api/Gost/GetUpdateGostDates/${props.id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((gosts) => {
        setUpdateGostDates(gosts.data);
      })
      .catch((error) => {
        console.log(error);
      });

    if (props.view || props.edit) {
      axios({
        method: "get",
        url: `/api/Gost/GetGost/${props.id}`,
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
        url: `/api/Gost/GetNormativeReferences/${props.id}`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((references) => {
          setNormativeReferences(references.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (props.add) {
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

  const replacedVisibilityChange = (event) => {
    event.preventDefault();
    setReplacedContainerVisibility(true);
  };

  const [gostIdReplaced, setGostIdReplaced] = useState([]);

  const handleReplacedChange = (event) => {
    setGostIdReplaced(event.target.value);
  };

  const excluded_keys = ["developerUser", "normativeReferences", "developerId"];

  const renderGostTable = () => {
    if (gost) {
      if (props.edit) {
        const editFields = [
          "designation",
          "denomination",
          "oksCode",
          "okpdCode",
          "content",
          "acceptanceLevel",
          "actionStatus",
        ];

        return (
          <>
            <tr key="id">
              <td>
                <label htmlFor="id">Номер</label>
              </td>
              <td>
                <label id="idEdit" htmlFor="id">
                  {props.id}
                </label>
              </td>
            </tr>

            {editFields.map((key, index) => (
              <tr key={index}>
                <td>
                  <label htmlFor={key}>{translationGostDict[key]}</label>
                </td>
                <td>
                  {key === "actionStatus" ? (
                    <select
                      className="gostInputEdit"
                      value={formData.actionStatus || gost.actionStatus}
                      onChange={(e) =>
                        handleInputChange("actionStatus", e.target.value)
                      }
                    >
                      <option value="">Выберите статус</option>
                      {actionStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : key === "acceptanceLevel" ? (
                    <select
                      className="gostInputEdit"
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
                      className="gostInputEdit"
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
              <td colspan="2">
                <div className="file-input-container">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    ref={selectedFile2Ref}
                  />
                </div>
              </td>
            </tr>
          </>
        );
      }
      return [
        ...Object.keys(gost)
          .filter((key) => !excluded_keys.includes(key))
          .map((key) => ({
            key,
            label: translationGostDict[key] || key,
            value: props.view ? (
              gost[key] ? (
                gost[key] === true ? (
                  "Да"
                ) : key === "acceptanceLevel" ? (
                  acceptanceLevelOptions.find(
                    (option) => option.value === gost[key]
                  )?.label
                ) : key === "actionStatus" ? (
                  actionStatusOptions.find(
                    (option) => option.value === gost[key]
                  )?.label
                ) : (
                  gost[key]
                )
              ) : (
                "Нет"
              )
            ) : (
              <input
                className="gostInput"
                placeholder={translationGostDict[key] || key}
                value={gost[key]}
                onChange={(e) => handleInputChange(key, e.target.value)}
              />
            ),
            updateDate:
              updateGostDates &&
              updateGostDates.some(
                (item) => item.name.toLowerCase() === key.toLowerCase()
              )
                ? updateGostDates
                    .find(
                      (item) => item.name.toLowerCase() === key.toLowerCase()
                    )
                    .updateDate.split("T")[0]
                : "",
          })),
        {
          key: "normativeReferences",
          label: "Нормативные ссылки",
          value: props.view ? (
            normativeReferences && normativeReferences.length > 0 ? (
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
            )
          ) : (
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
          ),
        },
        {
          key: "keywords",
          label: "Ключевые слова",
          value:
            keywords && keywords.length > 0 ? (
              <ul>
                {keywords.map((keyword) => (
                  <li>
                    <p>{keyword.name}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Нет ключевых слов</p>
            ),
        },
        {
          key: "keyphrases",
          label: "Ключевые фразы",
          value:
            keyphrases && keyphrases.length > 0 ? (
              <ul>
                {keyphrases.map((keyphrase) => (
                  <li>
                    <p>{keyphrase.name}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Нет ключевых фраз</p>
            ),
        },
        {
          key: "gestReplacedWith",
          label: "Принят взамен",
          value:
            gost.gostIdReplaced != undefined ? (
              <p>
                Взамен{" "}
                <a
                  href={`/gost/${gost.gostIdReplaced}`}
                  className="gostReplacedName"
                >
                  {gostReplacedName}
                </a>
              </p>
            ) : (
              <p>-</p>
            ),
        },
      ].map(({ key, label, value, updateDate }) => (
        <tr key={key}>
          <td>
            <label htmlFor={key}>{label}</label>
          </td>
          <td>{value}</td>
          <td>{updateDate}</td>
        </tr>
      ));
    } else {
      if (props.add) {
        const addFields = [
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
          "changes",
          "amendments",
          "acceptanceLevel",
          "actionStatus",
        ];

        return (
          <>
            {addFields.map((key, index) => (
              <tr key={index}>
                <td>
                  <label htmlFor={key}>{translationGostDict[key]}</label>
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
                      {actionStatusOptions.map((option) => (
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
                    {" "}
                    {selectedItems.map((item) => (
                      <li key={item.id}>{item.designation}</li>
                    ))}{" "}
                  </ul>
                ) : (
                  <p>Нет ссылок</p>
                )}

                <select onChange={handleSelectChange}>
                  {gostsNormativeReferences.map((item) => (
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
              <td colspan="2">
                <div className="file-input-container">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    ref={selectedFile2Ref}
                  />
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

    if (props.add) {
      axios({
        method: "post",
        url: `/api/Gost/AddGost`,
        data: {
          designation: formData.designation,
          denomination: formData.denomination,
          oksCode: formData.oksCode,
          okpdCode: formData.okpdCode,
          developerId: localStorage.getItem("id"),
          content: formData.content,
          keywords: formData.keywords.split(","),
          keyphrases: formData.keyphrases.split(","),
          acceptanceLevel: Number(formData.acceptanceLevel),
          text: formData.text,
          actionStatus: Number(formData.actionStatus),
          normativeReferences: normativeReferencesAdd,
          acceptanceYear: Number(formData.acceptanceYear),
          introdutionYear: Number(formData.introdutionYear),
          gostIdReplaced: Number(gostIdReplaced),
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then((gost) => {
        setGost(gost.data);

        /*
      var formData = new FormData();
      formData.append("gostFile", selectedFile2Ref.current.files[0]);

      axios({
        method: "post",
        url: `/api/Gost/AddFileToGost/?gostID=65`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((file) => {
          console.log(file.data);
        })
        .catch((error) => {
          console.log(error);
        });
        */
        navigate("/home");
      });
    }
    if (props.edit) {
      axios({
        method: "post",
        url: `/api/Gost/EditGost`,
        data: {
          id: props.id,
          designation: formData.designation,
          denomination: formData.denomination,
          oksCode: formData.oksCode,
          okpdCode: formData.okpdCode,
          content: formData.content,
          keywords: formData.keywords?.split(","),
          keyphrases: formData.keyphrases?.split(","),
          acceptanceLevel: Number(formData.acceptanceLevel),
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((gost) => {
          setGost(gost.data);
          navigate(`/gost/${props.id}`);
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
              {!props.add && !props.edit && (
                <th scope="col">Дата последней актуализации</th>
              )}
            </tr>
          </thead>
          <tbody>{renderGostTable()}</tbody>
        </table>
        {!props.view && props.edit && (
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
        {!props.view && props.add && (
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
