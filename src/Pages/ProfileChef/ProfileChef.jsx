import React, { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { BsBagHeart } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logocochu.png";
import hutieumuc from "../../assets/hutieumuc.jpg";
import garan from "../../assets/garan.jpg";
import Pizza from "../../assets/pizza.jpg";
import comboxao from "../../assets/comboxao.jpg";
import { Text } from "recharts";
import { BorderBottom, BorderColor } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Footer from "../Footer/Footer";
import Cookies from "js-cookie";
const ProfileChef = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cartList, setCartList] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    score: "",
    phone: "",
    address: "",
    money: "",
    banking: "",
    password: "",
    status: "",
    profilePicture: "",
    creatorId: "",
    hours: "",
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
    baseURL: "https://206.189.95.158/api/Chefs",
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
      setFormData({
        email: response.data.payload.email,
        name: response.data.payload.name,
        score: response.data.payload.score,
        phone: response.data.payload.phone,
        address: response.data.payload.address,
        money: response.data.payload.money,
        banking: response.data.payload.banking,
        password: response.data.payload.password,
        status: response.data.payload.status,
      });
    });
  }, []);
  const handleOrder = async (data) => {
    navigate("/order");
  };
  const HandlePayment = async () => {
    if (getCookie("username") != "") {
      navigate("/payment");
    }
  };

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
      name: formData.name,
      score: formData.score,
      phone: formData.phone,
      address: formData.address,
      money: formData.money,
      banking: formData.banking,
      password: formData.password,
      status: formData.status,
      profilePicture: formData.profilePicture,
      creatorId: formData.creatorId,
      hours: formData.hours,
    };

    const handleTopup = async (data) => {
      navigate("/topup");
    };
    const handleProfile = () => navigate("/profile");
    const handleLogIn = () => navigate("/login");
    const handleRegister = () => navigate("/register");
    const BackMainPage = () => navigate("/chefmain");
    const toggleCart = () => setIsOpen(!isOpen);
    const showDropDown = () => setOpen(!open);
    const handleLogout = () => {
      setCookie("username", "", 0);
      setCookie("usernamereal", "", 0);
      navigate("/");
      setUsername("");
    };
  
    let renderData = () => {
        if (getCookie("username") !== "") {
          return (
            <div className="flex items-center justify-between h-[150px] w-[100%] shadow-lg px-[155px]">
              <div className="cursor-pointer" onClick={BackMainPage}>
                <img src={Logo} alt="" width={150} height={150} />
              </div>
              <div className="flex items-center rounded-[5px]"></div>
              <div className="flex items-center gap-[15px] relative">
                <div
                  className="cursor-pointer flex items-center gap-[25px] border-r-[1px] pr-[25px]"
                  onClick={toggleCart}
                >
                  <BsBagHeart height={150} width={150} />
                </div>
                <div className="cursor-pointer flex items-center gap-[25px] border-r-[1px] pr-[25px]">
                   {/* Tiền: {user.money} */}
               </div>
          <div className="cursor-pointer flex items-center gap-[25px] border-r-[1px] pr-[25px]">
          {username}
          </div>
                <div
                  className="flex items-center gap-[10px] relative"
                  onClick={showDropDown}
                >
              
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
                 Thoát
                </p>
              </div>
                  )}
                </div>
              </div>
    


    api
      .put("/" + getCookie("username"), filteredData)
      .then((response) => {
        setUser(response.data.payload);
        setIsEditing(false);
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
  const BackMainPage = () => navigate("/chefmain");
  const toggleCart = () => setIsOpen(!isOpen);
  const showDropDown = () => setOpen(!open);
  const handleLogout = () => {
    setCookie("username", "", 0);
    setCookie("usernamereal", "", 0);
    navigate("/");
    setUsername("");
  };

  let renderData = () => {
    if (getCookie("username") !== "") {
      return (
        <div className="flex items-center justify-between h-[150px] w-[100%] shadow-lg px-[155px]">
          <div className="cursor-pointer" onClick={BackMainPage}>
            <img src={Logo} alt="" width={150} height={150} />
          </div>
          <div className="flex items-center rounded-[5px]"></div>
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
              <div className="w-[40px] h-[40px] rounded-full bg-[#4E73DF] cursor-pointer flex items-center justify-center relative">
                <img src="" alt="" />
              </div>
              {open && (
                <div className="bg-white border h-[120px] w-[150px] absolute bottom-[-135px] z-20 right-0 pt-[15px] pl-[15px] space-y-[10px]">
                  <p
                    className="cursor-pointer hover:text-[blue] font-semibold"
                    onClick={handleProfile}
                  >
                    Profile
                  </p>

                  <p
                    className="cursor-pointer hover:text-[blue] font-semibold"
                    onClick={handleOrder}
                  >
                    View Order
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

        <div className="relative ">
          {" "}
          {/* Adjust padding-bottom */}
          <div className="flex items-center justify-center">{renderData()}</div>
          {isOpen && (
            <div className="fixed inset-0 flex justify-end z-30">
              <div className="h-full w-[30%] shadow-lg px-6 py-4 bg-white overflow-y-auto relative">
                <button
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                  onClick={toggleCart}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
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
    
                  {/* Item 1 */}
                  {cartList.map((product) => (
                    <div
                      className="flex items-center justify-between border-b-2 border-gray-300 py-2"
                      key={product.id}
                    >
                      <div className="flex items-center space-x-4">
                        <button className="text-blue-600 text-2xl cursor-pointer">
                          -
                        </button>
                        <span className="text-xl">1</span>
                        <button className="text-blue-600 text-2xl cursor-pointer">
                          +
                        </button>
                        <span className="text-lg">{product.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg">{product.sellPrice}</span>
                        <button className="text-red-600 border border-red-600 px-2 py-1 rounded">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
    
                  {/* Total */}
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
                    <button
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300"
                      onClick={HandlePayment}
                    >
                      Thanh toán
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        <div className="flex justify-center mt-8">
          <div className="w-[80%]">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="form-group">
                    <label htmlFor="email" className="block text-lg font-medium mb-2">
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
                    <label htmlFor="firstName" className="block text-lg font-medium mb-2">
                     Tên:
                    </label>
                    <input
                      type="text"
                      className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName" className="block text-lg font-medium mb-2">
                     Điểm
                    </label>
                    <input
                      type="text"
                      className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      id="score"
                      name="score"
                      value={formData.score}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone" className="block text-lg font-medium mb-2">
                      Số diện thoại:
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
                    <label htmlFor="address" className="block text-lg font-medium mb-2">
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
                    <label htmlFor="gender" className="block text-lg font-medium mb-2">
                      Ngân hàng:
                    </label>
                    <input
                      type="text"
                      className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      id="banking"
                      name="banking"
                      value={formData.banking}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender" className="block text-lg font-medium mb-2">
                      Trạng thái:
                    </label>
                    <input
                      type="text"
                      className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    />
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

        <div className="flex items-center justify-between h-[150px] w-[70%] shadow-lg px-[25px]">
          <div className="cursor-pointer" onClick={BackMainPage}>
            <img src={Logo} alt="" width={150} height={150} />
          </div>
          <div className="flex items-center rounded-[5px]"></div>
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
                <img src="" alt="" />
              </div>
              <div
                onClick={handleRegister}
                className="cursor-pointer flex items-center justify-center relative"
              >
                /Đăng ký
                <img src="" alt="" />
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="relative pb-[100px]">
      {" "}
      {/* Adjust padding-bottom */}
      <div className="flex items-center justify-center">{renderData()}</div>
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

              {/* Item 1 */}
              {cartList.map((product) => (
                <div
                  className="flex items-center justify-between border-b-2 border-gray-300 py-2"
                  key={product.id}
                >
                  <div className="flex items-center space-x-4">
                    <button className="text-blue-600 text-2xl cursor-pointer">
                      -
                    </button>
                    <span className="text-xl">1</span>
                    <button className="text-blue-600 text-2xl cursor-pointer">
                      +

                    </button>
                    <span className="text-lg">{product.name}</span>
                  </div>

                </form>
              ) : (
                <div>
                  <h1 className="text-3xl font-semibold mb-6">Thông tin người bán</h1>
                  <p>
                    <strong>Email:</strong> {formData.email}
                  </p>
                  <p>
                    <strong>Tên:</strong> {formData.name}
                  </p>
                  <p>
                    <strong>Điểm:</strong> {formData.score}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {formData.phone}
                  </p>
                  <p>
                    <strong>Đăng ký:</strong> {formData.address}
                  </p>
                  <p>
                    <strong>Tiền:</strong> {formData.money}
                  </p>
                  <p>
                    <strong>Ngân hàng:</strong> {formData.banking}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong> {formData.status}
                  </p>
                  <div className="flex justify-center mt-6">
                    <button
                      className="btn btn-primary bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                      onClick={handleEdit}
                    >
                      Chỉnh sửa

                  <div className="flex items-center space-x-4">
                    <span className="text-lg">{product.sellPrice}</span>
                    <button className="text-red-600 border border-red-600 px-2 py-1 rounded">
                      Remove

                    </button>
                  </div>
                </div>
              ))}

              {/* Total */}
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
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300"
                  onClick={HandlePayment}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>


        <div style={{ marginTop: 'auto' }}>
  <Footer />
</div>

      )}
      <div className="flex justify-center mt-8">
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
                    Name:
                  </label>
                  <input
                    type="text"
                    className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="lastName"
                    className="block text-lg font-medium mb-2"
                  >
                    Score
                  </label>
                  <input
                    type="text"
                    className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    id="score"
                    name="score"
                    value={formData.score}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="phone"
                    className="block text-lg font-medium mb-2"
                  >
                    Phone:
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
                    Address:
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
                    htmlFor="gender"
                    className="block text-lg font-medium mb-2"
                  >
                    Money:
                  </label>
                  <input
                    type="text"
                    className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    id="money"
                    name="money"
                    value={formData.money}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="gender"
                    className="block text-lg font-medium mb-2"
                  >
                    Banking:
                  </label>
                  <input
                    type="text"
                    className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    id="banking"
                    name="banking"
                    value={formData.banking}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="gender"
                    className="block text-lg font-medium mb-2"
                  >
                    Status:
                  </label>
                  <input
                    type="text"
                    className="form-control block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ml-4"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h1 className="text-3xl font-semibold mb-6">
                  Profile Information
                </h1>
                <p>
                  <strong>Email:</strong> {formData.email}
                </p>
                <p>
                  <strong>Name:</strong> {formData.name}
                </p>
                <p>
                  <strong>Score:</strong> {formData.score}
                </p>
                <p>
                  <strong>Phone:</strong> {formData.phone}
                </p>
                <p>
                  <strong>Address:</strong> {formData.address}
                </p>
                <p>
                  <strong>Money:</strong> {formData.money}
                </p>
                <p>
                  <strong>Banking:</strong> {formData.banking}
                </p>
                <p>
                  <strong>Status:</strong> {formData.status}
                </p>
                <div className="flex justify-center mt-6">
                  <button
                    className="btn btn-primary bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileChef;
