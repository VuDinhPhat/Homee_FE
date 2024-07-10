import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiUserInstance from "../../service/api-user";
import LoginBG from "../../assets/Lgbg.png";
import LogoF from "../../assets/logoF.png";
import Logo2 from "../../assets/logo2.png";
import axios from "axios";
const RegisterChefPage = () => {
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setphone] = useState("");
  const [bankingId, setbankingId] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [address, setaddress] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e, inputType) => {
    const value = e.target.value;
    if (inputType === "firstname") {
      setFirstname(value);
    } else if (inputType === "email") {
      setEmail(value);
    } else if (inputType === "password") {
      setPassword(value);
    } else if (inputType === "confirmPassword") {
      setConfirmPassword(value);
    } else if (inputType === "phone") {
      setphone(value);
    } else if (inputType === "bankingId") {
      setbankingId(value);
    } else if (inputType === "address") {
      setaddress(value);
    }
  };

  const apiChef = axios.create({
    baseURL: "http://206.189.95.158/api/Chefs",
  });

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await apiChef.post("/register", {
        id: 0,
        name: firstname,
        address: address,
        creatorId: 0,
        profilePicture: "string",
        score: 0,
        hours: 0,
        status: "true",
        email: email,
        password: password,
        phone: phone,
        money: 0,
        banking: bankingId,
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
        <h1 className="text-2xl font-semibold mb-4">
          Đăng ký tài khoản người bán hàng
        </h1>
        {/* Username Input */}
        <div className="mb-4 w-full">
          <label htmlFor="firstname" className="block text-gray-600">
            Tên
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
            địa chỉ
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
          <label htmlFor="bankingId" className="block text-gray-600">
            Số tài khoản ngân hàng
          </label>
          <input
            type="number"
            id="bankingId"
            name="bankingId"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autoComplete="off"
            value={bankingId}
            onChange={(e) => handleInputChange(e, "bankingId")}
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
export default RegisterChefPage;
