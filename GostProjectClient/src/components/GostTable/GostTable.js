// styles
import "./GostTable.css";
// images

// libraries
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../Modal/Modal";
import { translationGostDict } from "../constants/translationGostDict";

const GostTable = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [gost, setGost] = useState();
  const [normativeReferences, setNormativeReferences] = useState([]);
  const [referenceGostNames, setReferenceGostNames] = useState({});

  // fdsfjkl

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // fsdhjkdsf

  const [isModalOpen, setModalOpen] = useState(false);
  const openModalCard = () => {
    setModalOpen(true);
    console.log(1213);
  };
  const closeModalCard = () => {
    setModalOpen(false);
  };

  const [updateGostDates, setUpdateGostDates] = useState();

  useEffect(() => {
    console.log("referenceGostNames", referenceGostNames);
  }, [referenceGostNames]);

  useEffect(() => {
    console.log("props.id", props.id);

    axios({
      method: "get",
      url: `/api/Gost/GetUpdateGostDates/${props.id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((gosts) => {
        console.log(gosts);
        console.log("update dates", gosts.data);
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
          console.log("just gosts", gost.data);
          setGost(gost.data);
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
          console.log(references.data);
          setNormativeReferences(references.data);
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
          console.log("fetchedGosts", fetchedGosts);
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

  const renderGostTable = () => {
    if (gost) {
      if (props.edit) {
        const editFields = [
          "designation",
          "denomination",
          "oksCode",
          "okpdCode",
          "content",
          "keywords",
          "keyphrases",
          "acceptanceLevel",
        ];

        console.log("formData", formData);

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
                  <input
                    className="gostInputEdit"
                    value={
                      formData[key] != undefined ? formData[key] : gost[key]
                    }
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                </td>
              </tr>
            ))}

            <div>
              <input type="file" onChange={handleFileChange} />
            </div>
          </>
        );
      }
      console.log("TEST FOR NOW", gost);
      return [
        ...Object.keys(gost)
          .filter(
            (key) => key !== "developerUser" && key !== "normativeReferences"
          )
          .map((key) => ({
            key,
            label: translationGostDict[key] || key,
            value: props.view ? (
              gost[key] ? (
                gost[key] === true ? (
                  "Да"
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
              !updateGostDates &&
              updateGostDates.some((item) => item.name.toLowerCase() === key)
                ? updateGostDates
                    .find((item) => item.name.toLowerCase() === key)
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
      ].map(({ key, label, value }) => (
        <tr key={key}>
          <td>
            <label htmlFor={key}>{label}</label>
          </td>
          <td>{value}</td>
        </tr>
      ));
    } else {
      if (props.add) {
        const addFields = [
          "designation",
          "denomination",
          "oksCode",
          "okpdCode",
          "developerId",
          "content",
          "keywords",
          "keyphrases",
          "acceptanceLevel",
          "text",
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
                  <input
                    className="gostInputAdd"
                    value={formData[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                </td>
              </tr>
            ))}
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
        </tr>
      ));
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    console.log(formData);
    console.log("ok");
    const formAddData = new FormData();
    formAddData.append("gostAddDto", JSON.stringify(formData));
    for (const key in formData) {
      formAddData.append(key, formData[key]);
    }

    // formData.append("file", selectedFile);

    console.log("formAddData", formAddData);
    console.log("TEST", formData.id);
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
          actionStatus: formData.actionStatus,
        },
        headers: {
          "Content-Type": "application/json",
          //'Authorization': Bearer ${localStorage.getItem("token")}
        },
      })
        .then((gost) => {
          console.log(gost.data);
          setGost(gost.data);
          navigate("/home");
        })
        .catch((error) => {
          console.log(error);
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
          //'Authorization': Bearer ${localStorage.getItem("token")}
        },
      })
        .then((gost) => {
          console.log(gost.data);
          setGost(gost.data);
          navigate("/home");
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
              <th scope="col">Первоначальное значение</th>
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
