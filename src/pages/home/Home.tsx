import { useEffect } from "react";
import { apiConfig } from "../../axios";

const Home = () => {
  const getCurrentUser = async () => {
    const details = localStorage.getItem("user");
    if (details) {
      const accessTokenDetail = JSON.parse(details).accessToken;

      const responce = await apiConfig.get("auth/me", {
        headers: {
          Authorization: `Bearer ${accessTokenDetail}`, // Pass JWT via Authorization header
        },
      });
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);
  return (
    <div>
      <h1 className="text-center text-orange-400 font-bold text-7xl">hello</h1>
    </div>
  );
};

export default Home;
