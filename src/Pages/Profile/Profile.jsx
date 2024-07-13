import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsBagHeart } from "react-icons/bs";
import Logo from "../../assets/logocochu.png";
import axios from "axios";
import Cookies from "js-cookie";

import Footer from "../Footer/Footer";

const Profile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  };

  const getCookie = (cname) => {
    const name = cname + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

  const api = axios.create({
    baseURL: "https://api.homee.id.vn/api/Users",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  useEffect(() => {
    setUsername(getCookie("usernamereal"));
    if (getCookie("username") === "") {
      navigate("/");
    }
    api.get("/" + getCookie("username")).then((response) => {
      setUser(response.data.payload);
      console.log(response.data.payload);
      setFormData({
        email: response.data.payload.email,
        firstName: response.data.payload.firstName,
        lastName: response.data.payload.lastName,
        phone: response.data.payload.phone,
        address: response.data.payload.address,
        dob: response.data.payload.dob,
        gender: response.data.payload.gender,
        password: response.data.payload.password || "",

        money: response.data.payload.money,
      });
    });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Filter out fields that are null or undefined and keep only the ones you want to update
    const filteredData = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address: formData.address,
      dob: formData.dob,
      gender: formData.gender,
      roleId: 1, // Default roleId to 1
      password: formData.password,
    };

    api
      .put("/" + getCookie("username"), filteredData)
      .then((response) => {
        setIsEditing(false);

        api.get("/" + getCookie("username")).then((response) => {
          setCookie(
            "usernamereal",
            response.data.payload.firstName + response.data.payload.lastName,
            10
          );

          setUsername(
            response.data.payload.firstName + response.data.payload.lastName
          );
        });
      })
      .catch((error) => {
        console.error("Update failed:", error);
        // Log detailed error information from server response
        console.error("Server error response:", error.response);
      });
  };

  const handleProfile = () => navigate("/profile");
  const handleLogIn = () => navigate("/login");
  const handleRegister = () => navigate("/register");
  const BackMainPage = () => navigate("/usermain");
  const toggleCart = () => setIsOpen(!isOpen);
  const showDropDown = () => setOpen(!open);
  const handleLogout = () => {
    setCookie("username", "", 0);
    setCookie("usernamereal", "", 0);
    navigate("/");
    setUsername("");
  };
  const handleOrder = async (data) => {
    navigate("/order");
  };

  const handleTopup = async (data) => {
    navigate("/topup");
  };
  let renderData = () => {
    if (getCookie("username") !== "") {
      return (
        <div className="flex items-center justify-between h-[150px] w-[100%] shadow-lg px-[150px]">
          <div className="cursor-pointer" onClick={BackMainPage}>
            <img src={Logo} alt="Logo" width={150} height={150} />
          </div>
          <div className="flex items-center gap-[15px] relative">
            <div
              className="cursor-pointer flex items-center gap-[25px] border-r-[1px] pr-[25px]"
              onClick={toggleCart}
            >
              <BsBagHeart height={150} width={150} />
            </div>

            <div className="cursor-pointer flex items-center gap-[25px] border-r-[1px] pr-[25px]">
              Tiền : {user.money}
            </div>
            <div className="cursor-pointer flex items-center gap-[25px] border-r-[1px] pr-[25px]">
              {username}
            </div>

            <div
              className="flex items-center gap-[10px] relative"
              onClick={showDropDown}
            >
              {/* <p>{username}</p> */}

              <div className="w-[40px] h-[40px] rounded-full bg-[#4E73DF] cursor-pointer flex items-center justify-center relative">
                <img src="" alt="" />
              </div>
              {open && (
                <div className="bg-white border h-[160px] w-[200px] absolute bottom-[-165px] z-20 right-0 pt-[15px] pl-[15px] space-y-[10px]">
                  <p
                    className="cursor-pointer hover:text-[blue] font-semibold"
                    onClick={handleTopup}
                  >
                    Nạp Tiền
                  </p>

                  <p
                    className="cursor-pointer hover:text-[blue] font-semibold"
                    onClick={handleProfile}
                  >
                    Thông tin Người dùng
                  </p>

                  <p
                    className="cursor-pointer hover:text-[blue] font-semibold"
                    onClick={handleOrder}
                  >
                    Lịch sử mua hàng
                  </p>
                  <p
                    className="cursor-pointer hover:text-[blue] font-semibold"
                    onClick={handleLogout}
                  >
                    Log out
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-between h-[150px] w-[100%] shadow-lg px-[150px]">
          <div className="cursor-pointer" onClick={BackMainPage}>
            <img src={Logo} alt="" width={150} height={150} />
          </div>
          <div className="flex items-center gap-[15px] relative">
            <div
              className="cursor-pointer flex items-center gap-[25px] border-r-[1px] pr-[25px]"
              onClick={toggleCart}
            >
              <BsBagHeart height={150} width={150} />
            </div>
            <div
              className="flex items-center gap-[10px] relative"
              onClick={showDropDown}
            >
              <p>{username}</p>
              <div
                onClick={handleLogIn}
                className="cursor-pointer flex items-center justify-center relative"
              >
                Đăng nhập
              </div>
              <div
                onClick={handleRegister}
                className="cursor-pointer flex items-center justify-center relative"
              >
                /Đăng ký
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-center mb-8">
        {renderData()}
      </div>
      {isOpen && (
        <div className="fixed inset-0 flex justify-end z-30">
          <div className="h-full w-[30%] shadow-lg px-6 py-4 bg-white overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={toggleCart}
            >
              <svg
                xmlns="https://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="border-b-2 border-gray-300 pb-4 mb-4">
              <h1 className="text-2xl font-semibold text-center">Giỏ hàng</h1>
              <h5 className="text-sm text-center text-gray-500">
                Thời gian giao: 15 phút (Cách bạn 1.5km)
              </h5>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Tên quán ăn</h2>
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between border-b-2 border-gray-300 py-2"
                >
                  <div className="flex items-center space-x-4">
                    <button className="text-blue-600 text-2xl cursor-pointer">
                      -
                    </button>
                    <span className="text-xl">{item}</span>
                    <button className="text-blue-600 text-2xl cursor-pointer">
                      +
                    </button>
                    <span className="text-lg">Combo gà rán kfc</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg">50.000</span>
                    <button className="text-red-600 border border-red-600 px-2 py-1 rounded">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Tổng</h3>
                  <h3 className="text-xl font-semibold">150.000</h3>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Phí giao hàng sẽ được thêm vào khi bạn thanh toán đơn hàng
                </p>
              </div>
              <div className="flex justify-center mt-6">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center mt-20 mb-10">
        <div className="w-[80%]">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-group">
                  <label
                    htmlFor="email"
                    className="block text-lg font-medium mb-2"
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="firstName"
                    className="block text-lg font-medium mb-2"
                  >
                    Họ:
                  </label>
                  <input
                    type="text"
                    className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="lastName"
                    className="block text-lg font-medium mb-2"
                  >
                   Tên:
                  </label>
                  <input
                    type="text"
                    className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="phone"
                    className="block text-lg font-medium mb-2"
                  >
                    Số điện thoại:
                  </label>
                  <input
                    type="text"
                    className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="address"
                    className="block text-lg font-medium mb-2"
                  >
                    Địa chỉ:
                  </label>
                  <input
                    type="text"
                    className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="dob"
                    className="block text-lg font-medium mb-2"
                  >
                    Ngày sinh:
                  </label>
                  <input
                    type="date"
                    className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="gender"
                    className="block text-lg font-medium mb-2"
                  >
                    Giới tính:
                  </label>
                  <select
                    className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                  >
                   Lưu
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ml-4"
                    onClick={() => setIsEditing(false)}
                  >
                    Huỷ
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h1 className="text-3xl font-semibold mb-2">
                 Thông tin người dùng
                </h1>
                <p>
                  <strong>Email:</strong> {formData.email}
                </p>
                <p>
                  <strong>Họ:</strong> {formData.firstName}
                </p>
                <p>
                  <strong>Tên:</strong> {formData.lastName}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {formData.phone}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {formData.address}
                </p>
                <p>
                  <strong>Ngày sinh:</strong> {formData.dob}
                </p>
                <p>
                  <strong>Giới tính:</strong> {formData.gender}
                </p>
                <div className="flex justify-center mt-6">
                  <button
                    className="btn btn-primary bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                    onClick={handleEdit}
                  >
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
