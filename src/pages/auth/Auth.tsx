import InputField from "../../components/shared/InputField";
import Button from "../../components/shared/Button";
import { useEffect, useState, type SubmitEvent } from "react";
import { apiConfig } from "../../axios";
import { useNavigate } from "react-router-dom";
function Auth() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userDetail = localStorage.getItem("user");
    if (userDetail) {
      navigate(`/`);
    }
  }, []);

  const handleLogin = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const responce = await apiConfig.post("auth/login", {
        username: userName,
        password: password,
        expiresInMins: 30, // optional
      });

      localStorage.setItem("user", JSON.stringify(responce.data));
      navigate(`/`);
    } catch (error) {
      alert("api don't fatch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleLogin}
        className="border p-5 rounded w-[50%] my-2 mx-auto flex flex-col gap-2 bg-[#ffffff]"
      >
        <h1 className="text-center font-bold text-3xl text-orange-400">
          Log In
        </h1>
        <InputField
          onChange={setUserName}
          type="text"
          placeholder="User Name"
          value={userName}
          isRequired={true}
        />
        <InputField
          onChange={setPassword}
          type="password"
          placeholder="password"
          value={password}
          isRequired={true}
        />
        <div className="text-end">
          <Button type="submit" btnTxt="Login" isLoading={loading} />
        </div>
      </form>
    </>
  );
}

export default Auth;
