import "./Payment.css"; // Import your CSS file for styling
import apiUserInstance from "../../service/api-user";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { FaEnvelope } from "react-icons/fa";
import { BsBagHeart } from "react-icons/bs";
import Logo from "../../assets/logo.png";
import LoginBG from "../../assets/Lgbg.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaStar, FaRegCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { CiClock1 } from "react-icons/ci";
import Cookies from "js-cookie";
const Payment = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [cartList, setCartList] = useState([]);
  const [formData, setFormData] = useState({
    restaurantName: "Pizza Chicago 24H - Mỳ Ý & Ăn Vặt",
    deliveryTime: "20 min (1,8 km away)",
    address: "69 Lo Lu St, P. Tương Bình Hiệp, Thị Thủ Dầu Một, Bình Dương",
    detailedAddress: "",
    driverNotes: "",
    paymentMethod: "",
    profile: "",
    promoCode: "",
  });
  const [listUser, setListUser] = useState({});
  const [items, setItems] = useState([
    { id: 1, name: "Pizza Margherita", price: 50000, quantity: 1 },
    { id: 2, name: "Spaghetti Carbonara", price: 70000, quantity: 1 },
  ]);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const showDropDown = () => {
    setOpen(!open);
  };

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
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  const handleLogout = async () => {
    setCookie("username", "", 0);
    setCookie("usernamereal", "", 0);
    navigate("/Detail");
    setUsername(getCookie("usernamereal"));
  };

  const handleLogIn = async () => {
    navigate("/login");
  };

  const handleRegister = async () => {
    navigate("/register");
  };

  const BackMainPage = async () => {
    navigate("/");
  };

  useEffect(() => {
    setUsername(getCookie("usernamereal"));
    if (getCookie("username") == "") {
      navigate("/");
    }
    const cookieData = Cookies.get("ArrayFood");
    if (cookieData) {
      const parsedData = JSON.parse(cookieData);
      setCartList(parsedData);
    }
    const storedAddress = getCookie("userAddress");
    apiUserInstance
      .get("/1")
      .then((response) => {
        const userData = response.data.payload;

        setListUser(userData);

        // Update form data with user's address if stored address not found
        if (!storedAddress) {
          setFormData({
            ...formData,
            address: userData.address,
            detailedAddress: userData.detailedAddress,
            driverNotes: userData.driverNotes,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []); // Empty dependency array ensures this effect runs only once

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted:", formData);
    // Implement form submission logic here

    // Set address cookie when form is submitted
    setCookie("userAddress", formData.address, 1); // Set cookie with 1 day expiration
  };

  const applyPromoCode = () => {
    console.log("Promo code applied:", formData.promoCode);
    // Implement promo code application logic here
  };

  const increaseQuantity = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setItems(
      items.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

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

  const renderData = () => {
    if (getCookie("username") !== "") {
      return (
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
              <div className="w-[40px] h-[40px] rounded-full bg-[#4E73DF] cursor-pointer flex items-center justify-center relative">
                <img src="" alt="" />
              </div>
              {open && (
                <div className="bg-white border h-[120px] w-[150px] absolute bottom-[-135px] z-20 right-0 pt-[15px] pl-[15px] space-y-[10px]">
                  <p className="cursor-pointer hover:text-[blue] font-semibold">
                    Profile
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
                <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300">
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-body">
                <h1 className="card-title">Giao đến</h1>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="deliveryTime">Delivery arrival time:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="deliveryTime"
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleChange}
                      readOnly
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Map:</label>
                        <div className="map-placeholder">[Map]</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        {listUser.id ? (
                          <div key={listUser.id}>
                            <label htmlFor="address">Địa chỉ:</label>
                            <textarea
                              className="form-control"
                              id="address"
                              name="address"
                              rows="3"
                              value={listUser.address}
                              onChange={handleChange}
                            />
                          </div>
                        ) : (
                          <p>Không có địa chỉ</p>
                        )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="detailedAddress">
                          Chi tiết địa chỉ:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="detailedAddress"
                          name="detailedAddress"
                          value={formData.detailedAddress}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="driverNotes">Ghi chú cho tài xế:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="driverNotes"
                          name="driverNotes"
                          value={formData.driverNotes}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="card shadow">
              <div className="card-body">
                <h2 className="card-title">Chi tiết thanh toán</h2>
                <form>
                  <div className="form-group">
                    <label htmlFor="paymentMethod">
                      Phương thức thanh toán:
                    </label>
                    <select
                      className="form-control"
                      id="paymentMethod"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                    >
                      <option value="">Chọn phương thức thanh toán</option>
                      <option value="cash">Tiền mặt</option>
                      <option value="creditCard">Thẻ tín dụng</option>
                      <option value="momo">Momo</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="profile">Hồ sơ thẻ:</label>
                    <select
                      className="form-control"
                      id="profile"
                      name="profile"
                      value={formData.profile}
                      onChange={handleChange}
                    >
                      <option value="">Chọn hồ sơ thẻ</option>
                      <option value="person1">Person 1</option>
                      <option value="person2">Person 2</option>
                    </select>
                  </div>
                </form>
              </div>
            </div>

            <div className="card shadow">
              <div className="card-body">
                <h2 className="card-title">Khuyến mãi</h2>
                <div className="form-group">
                  <label htmlFor="promoCode">Nhập mã khuyến mãi:</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="promoCode"
                      name="promoCode"
                      value={formData.promoCode}
                      onChange={handleChange}
                    />
                    <div className="input-group-append">
                      <button type="button" className="btn btn-primary ml-2">
                        Áp dụng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="card-title mb-0">
                    Tổng cộng: {calculateTotal()} ₫
                  </h2>
                </div>
                <button type="submit" className="btn btn-primary btn-lg">
                  Đặt hàng ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
