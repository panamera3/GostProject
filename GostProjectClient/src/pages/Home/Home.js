import "./Home.css";
import HeaderAdmin from "../../components/HeaderAdmin/HeaderAdmin";
import HeaderUser from "../../components/Header/HeaderUser";
import GostsTable from "../../components/GostsTable/GostsTable";
import { BodyContainer } from "../../components/styles/styled_components";

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
            <a href="/search">Назад</a>
          </div>
        )}
        {favourites && (
          <div className="activities_container">
            <a href="/home">Назад</a>
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
