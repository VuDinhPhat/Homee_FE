import React, { useEffect, useState, useRef } from "react";
import { FaEnvelope } from "react-icons/fa";
import { BsBagHeart } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logocochu.png";
import LoginBG from "../../assets/Lgbg.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import Footer from "../Footer/Footer";
import { FaStar, FaRegCalendarAlt } from "react-icons/fa";
import { CiClock1 } from "react-icons/ci";
import Giohang from"../../assets/giohang.png";
const Detail = () => {
  const [username, setUsername] = useState("");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({});
  const [total, setTotal] = useState(0);

  const [chef, setChef] = useState({});
  const [foodList, setFoodList] = useState([]);
  const [cartList, setCartList] = useState([]);
  const yellowColor = "#fde047";


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

  const handleRemove = async (data) => {
    const newItems = cartList.filter((item, i) => i !== data);
    setCartList(newItems);
    let tmp = 0;
    newItems.map((item) => {
      tmp = tmp + item.sellPrice;
    });
    setTotal(tmp);

    const jsonData = JSON.stringify(newItems);
    Cookies.set("ArrayFood", jsonData, { expires: 10 });
  };

  const HandlePayment = async () => {
    if (getCookie("username") != "") {
      navigate("/payment");
    } else {
      alert("Bạn chưa đăng nhập");
    }
  };

  const handleOrder = async (data) => {
    navigate("/order");
  };

  const handleTopup = async (data) => {
    navigate("/topup");
  };

  const handleProfile = () => navigate("/profile");

  const addFood = async (data) => {
    let dataArray = [];
    const cookieData = Cookies.get("ArrayFood");

    if (cookieData) {
      dataArray = JSON.parse(cookieData);
      setCartList(dataArray);
    }
    if (cartList == "") {
      dataArray.push(data);
      const jsonData = JSON.stringify(dataArray);
      Cookies.set("ArrayFood", jsonData, { expires: 7 });
      let tmp = 0;
      dataArray.map((item) => {
        tmp = tmp + item.sellPrice;
      });
      setTotal(tmp);
      alert("Thêm sản phẩm thành công");
    } else {
      let tmp = true;
      cartList.map((item) => {
        if (item.chefId !== data.chefId) {
          tmp = false;
        }
      });
      if (tmp) {
        dataArray.push(data);
        const jsonData = JSON.stringify(dataArray);
        Cookies.set("ArrayFood", jsonData, { expires: 7 });
        let tmp = 0;
        dataArray.map((item) => {
          tmp = tmp + item.sellPrice;
        });
        setTotal(tmp);
        alert("Thêm sản phẩm thành công");
      }
    }
  };

  const BackMainPage = async () => {
    navigate("/usermain");
  };
  const BackMainPage1 = async () => {
    navigate("/");
  };

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

  const apiFood = axios.create({
    baseURL: "https://api.homee.id.vn/api/Foods",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  const apiChef = axios.create({
    baseURL: "https://api.homee.id.vn/api/Chefs",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });
  const apiUser = axios.create({
    baseURL: "https://api.homee.id.vn/api/Users",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  useEffect(() => {
    setUsername(getCookie("usernamereal"));

    apiFood.get("?pageIndex=1&pageSize=1000").then(async (response) => {
      console.log(response.data.payload);
      let tmp = [];
      response.data.payload.map((item, index) => {
        if (item.chefId == getCookie("chefid")) {
          tmp.push(item);
        }
      });
      setFoodList(tmp);
      console.log(tmp);
    });

    apiChef.get("/" + getCookie("chefid")).then(async (response) => {
      setChef(response.data.payload);
    });
    const cookieData = Cookies.get("ArrayFood");
    if (cookieData) {
      const parsedData = JSON.parse(cookieData);
      setCartList(parsedData);
      let tmp = 0;
      parsedData.map((item) => {
        tmp = tmp + item.sellPrice;
      });
      setTotal(tmp);
    }
    apiUser.get("/" + getCookie("username")).then((response) => {
      setUser(response.data.payload);
    });
  }, []);

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
        
              <img src={Giohang} alt="Logo" width={35} height={35} />
            </div>

            <div className="cursor-pointer flex items-center gap-[25px] border-r-[1px] pr-[25px] font-bold text-lg">
              Tiền : {user.money}
            </div>
            <div className="cursor-pointer flex items-center gap-[25px] border-r-[1px] pr-[25px] font-bold text-lg">
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
                   Thoát
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
        <div className="cursor-pointer" onClick={BackMainPage1}>
          <img src={Logo} alt="" width={150} height={150} />
        </div>
        <div className="flex items-center rounded-[5px]"></div>
        <div className="flex items-center gap-[15px] relative">
        <div
              className="cursor-pointer flex items-center gap-[25px] border-r-[1px] pr-[25px]"
              onClick={toggleCart}
            >
        
              <img src={Giohang} alt="Logo" width={35} height={35} />
            </div>
          <div
            className="flex items-center gap-[10px] relative"
            onClick={showDropDown}
          >
            <p>{username}</p>
            <div
              onClick={handleLogIn}
              className="cursor-pointer flex items-center justify-center relative font-bold text-lg"
            >
              Đăng nhập
              <img src="" alt="" />
            </div>
            <div
              onClick={handleRegister}
              className="cursor-pointer flex items-center justify-center relative font-bold text-lg"
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

  const handleDetail = (id) => {
    navigate(`/food/${id}`);
  };

  return (
<div>
    {/* <div className="flex items-center justify-center">{renderData()}</div> */}
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
            <h2 className="text-lg font-semibold mb-4"></h2>

            {/* Item 1 */}
            {cartList.map((product, index) => (
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
                  <span className="text-lg">{product.sellPrice} VND</span>
                  <button
                    className="text-red-600 border border-red-600 px-2 py-1 rounded"
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Tổng</h3>
                <h3 className="text-xl font-semibold">{total} VND</h3>
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



    <div className="w-[100%] h-[100%]">

      {renderData()}
    
      <div className="flex items-center justify-between mt-5  px-[150px]">
          <div>
            <h1 className="font-bold">Bếp nhà: {chef.name}</h1>

            <div className="flex items-center">
              <FaStar style={{ color: yellowColor }} />
              <p className="ml-2 mt-3">{chef.score}</p>
            </div>
            <div className="flex items-center">
              <CiClock1 />
              <p className="ml-2 mt-3">Giờ mở cửa</p>
            </div>

            <p>Hôm nay mở cửa: {chef.hours} tiếng</p>
            <p>Tận hưởng ưu đãi</p>

            <div className="flex mt-5">
              <button
                className="border border-green-500 h-[50px] w-[100%] flex items-center justify-center mr-4 bg-customColor "
             
              >
                <div className="flex items-center ">
                  <FaRegCalendarAlt />
                  <p className="ml-2 mt-3 text-xl font-bold text-white ">
                    Ưu đãi hôm nay
                  </p>
                </div>
              </button>
            </div>

</div>
</div>
        <div className="flex items-center justify-between mt-5  px-[150px]" >
        <Row>
          {foodList.map((food, index) => (
            <Col>
              <div className="card mb-4 w-[300px] h-[300px]">
          
                <img
                  className="card-img-top w-[150px] h-[200px]"
                  src={food.image}
                  alt={food.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{food.name}</h5>
                  <p className="card-text">
                    Giá: {food.price} <br />
                    Giá bán: {food.sellPrice} <br />
                    Trạng thái: {food.status} <br />
                    Số lượng đã bán: {food.sellCount} <br />
                    Loại món: {food.foodType}
                  </p>
                  <Button variant="primary" onClick={() => addFood(food)}>
                    Thêm vào giỏ
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        </div>
      </div>
    <Footer />
    </div>
  );
};

export default Detail;
