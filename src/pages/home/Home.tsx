import { useEffect, useState } from "react";
import { apiConfig } from "../../axios";

interface User {
  email: string;
  eyeColor: string;
  firstName: string;
  gender: string;
}

const Home = () => {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const getCurrentUser = async () => {
    const details = localStorage.getItem("user");
    if (details) {
      const accessTokenDetail = JSON.parse(details).accessToken;

      const responce = await apiConfig.get("auth/me", {
        headers: {
          Authorization: `Bearer ${accessTokenDetail}`, // Pass JWT via Authorization header
        },
      });
      setUserDetails(responce.data);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);
  return (
    <div>
      <h1 className=" text-[#014369] font-bold mt-5 text-4xl">
        hello{" "}
        <span className=" text-[#003655] underline">
          {userDetails?.firstName}
        </span>
        , Now you can go to product page
      </h1>
    </div>
  );
};

export default Home;
