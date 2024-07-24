import { useParams } from "react-router-dom";
import HeaderAdmin from "../../../components/HeaderAdmin/HeaderAdmin";
import GostTable from "../../../components/GostTable/GostTable";
import { BodyContainer } from "../../../components/styles/styled_components";
import BackLink from "../../../components/BackLink/BackLink";

const GostEdit = () => {
  const params = useParams();

  return (
    <>
      <HeaderAdmin />
      <BodyContainer>
        <div className="activities_container">
          <div>
            <BackLink />
          </div>
          <div>
            <p>Редактирование ГОСТа</p>
          </div>
        </div>
        <GostTable edit id={params.id} />
      </BodyContainer>
    </>
  );
};

export default GostEdit;
