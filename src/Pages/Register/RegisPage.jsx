import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiUserInstance from "../../service/api-user";
import LoginBG from "../../assets/loginha.jpg";
import LogoF from "../../assets/logoF.png";
import Logo2 from "../../assets/logo2.png";
import axios from "axios";
const RegisterPage = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setphone] = useState("");
  const [address, setaddress] = useState("");
  const [dob, setdob] = useState("");
  const [gender, setgender] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e, inputType) => {
    const value = e.target.value;
    if (inputType === "firstname") {
      setFirstname(value);
    } else if (inputType === "lastname") {
      setLastname(value);
    } else if (inputType === "email") {
      setEmail(value);
    } else if (inputType === "password") {
      setPassword(value);
    } else if (inputType === "confirmPassword") {
      setConfirmPassword(value);
    } else if (inputType === "phone") {
      setphone(value);
    } else if (inputType === "address") {
      setaddress(value);
    } else if (inputType === "dob") {
      setdob(value);
    } else if (inputType === "gender") {
      setgender(value);
    }
  };

  const apiUser = axios.create({
    baseURL: "https://api.homee.id.vn/api/Users",
  });

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      // const formData = new FormData();
      // formData.append("id", "0"); // Assuming 'id' is a string field in your backend
      // formData.append("email", email);
      // formData.append("firstName", firstname);
      // formData.append("lastName", lastname);
      // formData.append("password", password);
      // formData.append("phone", phone);
      // formData.append("address", address);
      // formData.append("dob", dob);
      // formData.append("gender", gender);

      // formData.append("avatar", "string"); // Assuming 'avatar' is a string field
      // formData.append("roleId", "1"); // Assuming 'roleId' is a string field
      // formData.append("status", "true"); // Assuming 'status' is a string field
      // formData.append("money", "0"); // Assuming 'money' is a string field
      // formData.append("discount", "0"); // Assuming 'discount' is a string field

      // const response = await axios.post(
      //   "https://206.189.95.158/api/Users",
      //   formData
      // );

      const response = await apiUser.post("/Register", {
        id: 0,
        email: email,
        firstName: firstname,
        lastName: lastname,
        password: password,
        phone: phone,
        address: address,
        dob: dob,
        gender: gender,
        avatar: "string",
        roleId: 1,
        status: "true",
        money: 0,
        discount: 0,
      });

      if (response.data.status) {
        // Đăng ký thành công, điều hướng tới trang đăng nhập
        alert("Bạn đã đăng ký thành công");
        navigate("/login");
      } else {
        // Xử lý lỗi đăng ký không thành công
        setErrorMessage(
          response.data.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Registration failed", error);
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <img
        src={LoginBG}
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full"
      />
      <div className="relative z-10 bg-gray-100 bg-opacity-80 flex flex-col items-center justify-center h-full w-full max-w-md p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <img className="w-[380px]" src={Logo2} alt="Logo" />
        </div>
        <h1 className="text-2xl font-semibold mb-4">Đăng ký tài khoản</h1>
        {/* Username Input */}
        <div className="mb-4 w-full">
          <label htmlFor="firstname" className="block text-gray-600">
            Họ, tên đệm
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autoComplete="off"
            value={firstname}
            onChange={(e) => handleInputChange(e, "firstname")}
          />
        </div>
        <div className="mb-4 w-full">
          <label htmlFor="lastname" className="block text-gray-600">
            Tên
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autoComplete="off"
            value={lastname}
            onChange={(e) => handleInputChange(e, "lastname")}
          />
        </div>
        <div className="mb-4 w-full">
          <label htmlFor="phone" className="block text-gray-600">
            Số điện thoại
          </label>
          <input
            type="number"
            id="phone"
            name="phone"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autoComplete="off"
            value={phone}
            onChange={(e) => handleInputChange(e, "phone")}
          />
        </div>
        <div className="mb-4 w-full">
          <label htmlFor="address" className="block text-gray-600">
            Địa chỉ
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autoComplete="off"
            value={address}
            onChange={(e) => handleInputChange(e, "address")}
          />
        </div>
        <div className="mb-4 w-full">
          <label htmlFor="dob" className="block text-gray-600">
            Ngày sinh
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autoComplete="off"
            value={dob}
            onChange={(e) => handleInputChange(e, "dob")}
          />
        </div>
        <div className="mb-4 w-full">
          <label htmlFor="gender" className="block text-gray-600">
            Giới tính
          </label>
          <input
            type="text"
            id="gender"
            name="gender"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autoComplete="off"
            value={gender}
            onChange={(e) => handleInputChange(e, "gender")}
          />
        </div>
        {/* Email Input */}
        <div className="mb-4 w-full">
          <label htmlFor="email" className="block text-gray-600">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autoComplete="off"
            value={email}
            onChange={(e) => handleInputChange(e, "email")}
          />
        </div>
        {/* Password Input */}
        <div className="mb-4 w-full">
          <label htmlFor="password" className="block text-gray-600">
            Mật khẩu
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autoComplete="off"
            value={password}
            onChange={(e) => handleInputChange(e, "password")}
          />
        </div>
        {/* Confirm Password Input */}
        <div className="mb-6 w-full">
          <label htmlFor="confirmPassword" className="block text-gray-600">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autoComplete="off"
            value={confirmPassword}
            onChange={(e) => handleInputChange(e, "confirmPassword")}
          />
        </div>
        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        {/* Register Button */}
        <button
          onClick={handleRegister}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
        >
          Đăng ký
        </button>
        {/* Back to Login Link */}
        <div className="flex justify-center items-center mt-4">
          <p className="text-gray-600">
            Đã có tài khoản?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Đăng nhập tại đây
            </span>
          </p>
        </div>
        <div className="flex flex-1 justify-center items-end h-100 mt-4">
          <p className="text-center">Bản quyền &copy; 2024 Homee Competition</p>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
