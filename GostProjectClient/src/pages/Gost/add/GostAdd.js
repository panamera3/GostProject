import HeaderAdmin from "../../../components/HeaderAdmin/HeaderAdmin";
import GostTable from "../../../components/GostTable/GostTable";
import { BodyContainer } from "../../../components/styles/styled_components";

const GostAdd = () => {
  return (
    <>
      <HeaderAdmin />
      <BodyContainer>
        <div>
          <a href="/home">Назад</a>
        </div>
        <GostTable add />
      </BodyContainer>
    </>
  );
};

export default GostAdd;
