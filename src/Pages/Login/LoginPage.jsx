import React, { useEffect, useState } from "react";
import LoginBG from "../../assets/LGBG.jpg";
import Logo2 from "../../assets/logo2.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const navigate = useNavigate();

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  }

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  useEffect(() => {
    var username = getCookie("username");
    var userrole = getCookie("userrole");
    if (username !== "") {
      if (userrole !== "" && userrole == 1) {
        navigate("/usermain");
      } else if (userrole !== "" && userrole == 2) {
        navigate("/adminmain");
      }
      navigate("/chefmain");
    }
  }, []);

  const handleInputChange = (e, inputType) => {
    const value = e.target.value;

    if (inputType === "username") {
      setUsername(value);
    } else if (inputType === "password") {
      setPassword(value);
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const notify = (message) => {
    toast(message);
  };

  const handleLoginUser = async () => {
    try {
      const response = await axios.post(
        "https://localhost:44388/api/Users/Login",
        {
          id: 0,
          email: username,
          firstName: "string",
          lastName: "string",
          password: password,
          phone: "string",
          address: "string",
          dob: "2024-07-05",
          gender: "string",
          avatar: "string",
          roleId: 1,
          status: "string",
          money: 0,
          discount: 0,
        }
      );

      if (
        response.data &&
        response.data.userResponse &&
        response.data.userResponse.id
      ) {
        const userId = response.data.userResponse.id;

        const userResponse = await axios.get(
          `https://localhost:44388/api/Users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${response.data.token}`,
            },
          }
        );

        if (userResponse.data && userResponse.data.payload) {
          const userFullName =
            userResponse.data.payload.firstName +
            userResponse.data.payload.lastName;
          setCookie("usernamereal", userFullName, 10);
          setCookie("userrole", userResponse.data.payload.role_id, 10);

          setCookie("username", userId, 10);
          setCookie("token", response.data.token, 10);

          navigate("/usermain");
        } else {
          notify("Failed to fetch user data.");
        }
      } else {
        alert("Đăng nhập không thành công");
      }
    } catch (error) {
      notify("Login fail!");
      alert("Đăng nhập không thành công");
    }
  };

  const handleLoginChef = async () => {
    try {
      const response = await axios.post(
        "https://localhost:44388/api/Chefs/login",
        {
          id: 0,
          name: "string",
          address: "string",
          creatorId: 0,
          profilePicture: "string",
          score: 0,
          hours: 0,
          status: "string",
          email: username,
          password: password,
          phone: "string",
          money: 0,
          banking: "string",
        }
      );

      if (
        response.data &&
        response.data.chefResponse &&
        response.data.chefResponse.id
      ) {
        const chefId = response.data.chefResponse.id;

        const chefResponse = await axios.get(
          `https://localhost:44388/api/Chefs/${chefId}`,
          {
            headers: {
              Authorization: `Bearer ${response.data.token}`,
            },
          }
        );

        if (chefResponse.data && chefResponse.data.payload) {
          const chefFullName = chefResponse.data.payload.name;
          setCookie("usernamereal", chefFullName, 10);
          console.log(chefFullName);

          console.log(response.data.token);
          localStorage.setItem("token", "nice");
          setCookie("username", chefId, 10);
          setCookie("token", response.data.token, 10);

          navigate("/chefmain");
        } else {
          notify("Failed to fetch chef data.");
          alert("Đăng nhập không thành công");
        }
      } else {
        notify("Invalid login response.");
        alert("Đăng nhập không thành công");
      }
    } catch (error) {
      notify("Login fail!");
      alert("Đăng nhập không thành công");
    }
  };

  const handleLogin = () => {
    if (role === "user") {
      handleLoginUser();
    } else {
      handleLoginChef();
    }
  };

  return (
    <div className="relative">
      <img
        src={LoginBG}
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full"
      />
      <div className="flex justify-center items-center min-h-screen relative z-10">
        <div className="bg-gray-100 bg-opacity-80 flex flex-col justify-center items-center w-full max-w-md mx-auto p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-center mb-2">
            <img className="w-[250px]" src={Logo2} alt="Logo" />
          </div>
          <h1 className="text-2xl font-semibold mb-4">Đăng Nhập</h1>
          <div className="mb-4 w-full text-xl">
            <label htmlFor="username" className="block text-gray-600">
              Email
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autoComplete="off"
              value={username}
              onChange={(e) => handleInputChange(e, "username")}
            />
          </div>
          <div className="mb-4 w-full text-xl">
            <label htmlFor="password" className="block text-gray-600">
           Mật Khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autoComplete="off"
              value={password}
              onChange={(e) => handleInputChange(e, "password")}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLogin();
                }
              }}
            />
          </div>
          <div className="mb-4 w-full text-xl">
            <label className="block text-gray-600">Vai trò</label>
            <div className="flex items-center">
              <input
                type="radio"
                id="user"
                name="role"
                value="user"
                checked={role === "user"}
                onChange={handleRoleChange}
                className="mr-2"
              />
              <label htmlFor="user" className="mr-4">
               Người dùng
              </label>
              <input
                type="radio"
                id="chef"
                name="role"
                value="chef"
                checked={role === "chef"}
                onChange={handleRoleChange}
                className="mr-2"
              />
              <label htmlFor="chef">Đầu bếp</label>
            </div>
          </div>

          <div className="flex justify-center items-center mt-4">
            <p className="text-gray-600">
              Chưa có tài khoản?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Đăng ký tại đây
              </span>
            </p>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
            onClick={handleLogin}
          >
            Đăng Nhập
          </button>
          <div className="flex justify-center items-end mt-4">
            <p className="text-center">
              Copyright&copy; 2024 Homee Competition
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
