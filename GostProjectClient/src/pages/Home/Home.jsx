import "./Home.css";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import HeaderUser from "../../components/Header/HeaderUser";
import GostsTable from "../../components/GostsTable/GostsTable";
import { BodyContainer } from "../../components/styles/styled_components";
import BackLink from "../../components/BackLink/BackLink";

const Home = ({ searchGosts, favourites, archiveGosts }) => {
  return (
    <>
      {localStorage.getItem("role") == "Admin" ? (
        <HeaderAdmin />
      ) : (
        <HeaderUser />
      )}
      <BodyContainer>
        {searchGosts && (
          <div className="activities_container">
            <BackLink />
          </div>
        )}
        {favourites && (
          <div className="activities_container">
            <BackLink />
          </div>
        )}
        <GostsTable
          favourites={favourites}
          searchGosts={searchGosts}
          archiveGosts={archiveGosts}
        />
      </BodyContainer>
    </>
  );
};

export default Home;
