import HeaderAdmin from "../../../components/HeaderAdmin/HeaderAdmin";
import GostTable from "../../../components/GostTable/GostTable";
import { BodyContainer } from "../../../components/styles/styled_components";
import BackLink from "../../../components/BackLink/BackLink";

const GostAdd = () => {
  return (
    <>
      <HeaderAdmin />
      <BodyContainer>
        <div>
          <BackLink />
        </div>
        <GostTable add />
      </BodyContainer>
    </>
  );
};

export default GostAdd;
