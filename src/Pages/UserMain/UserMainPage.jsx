import React, { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { BsBagHeart } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import hutieumuc from "../../assets/hutieumuc.jpg";
import garan from "../../assets/garan.jpg";
import Pizza from "../../assets/pizza.jpg";
import comboxao from "../../assets/comboxao.jpg";
import { Text } from "recharts";
import { BorderBottom, BorderColor } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import "./UserMainPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
const UserMainPage = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [listFood, setListFood] = useState([]);
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
    navigate("/");
    setUsername(getCookie("usernamereal"));
  };

  const api = axios.create({
    baseURL: "https://localhost:44388/api/Chefs",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  const handleProfile = async () => {};

  const handleLogIn = async () => {
    navigate("/login");
  };

  const handleRegister = async () => {
    navigate("/register");
  };

  const handleDetail = async (data) => {
    setCookie("chefid", data, 10);
    navigate("/detail");
  };

  const BackMainPage = async () => {};

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
    setUsername(getCookie("usernamereal"));
    if (getCookie("username") == "") {
      navigate("/");
    }
    api.get("?pageIndex=1&pageSize=8").then((response) => {
      setListFood(response.data.payload);
    });
  }, []);

  let renderData = () => {
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
                  <p
                    className="cursor-pointer hover:text-[blue] font-semibold"
                    onClick={handleProfile}
                  >
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
          <div>
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

  const promotions = [
    {
      title: "Quán Cơm 2 Lúa",
      rating: 4.1,
      time: "15 phút",
      distance: "1 km",
      discount: "Ưu đãi đến 22K",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      title: "Cơm Chiên Gà Xối Mỡ Hương Ký",
      rating: 4.6,
      time: "15 phút",
      distance: "1.2 km",
      discount: "Ưu đãi đến 52K",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      title: "Cơm Rang - Bánh Mì Mahai Quận 09",
      rating: 4.8,
      time: "15 phút",
      distance: "1.1 km",
      discount: "Ưu đãi đến 46K",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      title: "Cơm Tấm Minh Mập - Lò Lu",
      rating: 3.8,
      time: "20 phút",
      distance: "3.8 km",
      discount: "Ưu đãi đến 46K",
      imageUrl: "https://via.placeholder.com/150",
    },
  ];
  const categories = [
    { title: "Gà rán", imageUrl: "https://via.placeholder.com/150" },
    { title: "Weekend Treats", imageUrl: "https://via.placeholder.com/150" },
    { title: "Pizza", imageUrl: "https://via.placeholder.com/150" },
    { title: "Hủ tiếu", imageUrl: "https://via.placeholder.com/150" },
    { title: "Hiso Party", imageUrl: "https://via.placeholder.com/150" },
    { title: "Cơm tấm", imageUrl: "https://via.placeholder.com/150" },
    { title: "Cơm", imageUrl: "https://via.placeholder.com/150" },
    { title: "Gà Rán - Burger", imageUrl: "https://via.placeholder.com/150" },
    { title: "Cháo", imageUrl: "https://via.placeholder.com/150" },
    { title: "Rau trộn", imageUrl: "https://via.placeholder.com/150" },
    { title: "Mì Ý", imageUrl: "https://via.placeholder.com/150" },
    { title: "Ăn Vặt", imageUrl: "https://via.placeholder.com/150" },
  ];

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
              <div className="flex items-center justify-between border-b-2 border-gray-300 py-2">
                <div className="flex items-center space-x-4">
                  <button className="text-blue-600 text-2xl cursor-pointer">
                    -
                  </button>
                  <span className="text-xl">1</span>
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

              {/* Item 2 */}
              <div className="flex items-center justify-between border-b-2 border-gray-300 py-2">
                <div className="flex items-center space-x-4">
                  <button className="text-blue-600 text-2xl cursor-pointer">
                    -
                  </button>
                  <span className="text-xl">2</span>
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

              {/* Item 3 */}
              <div className="flex items-center justify-between border-b-2 border-gray-300 py-2">
                <div className="flex items-center space-x-4">
                  <button className="text-blue-600 text-2xl cursor-pointer">
                    -
                  </button>
                  <span className="text-xl">3</span>
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
      <div className="container mt-5">
        <form className="my-4">
          <div className="form-group">
            <label htmlFor="address">Địa chỉ giao hàng:</label>
            <input
              type="text"
              className="form-control"
              id="address"
              placeholder="182 Lã Xuân Oai - 182 Lã Xuân Oai, P. Tăng Nhơn Phú A, Tp. Thủ Đức"
              required
            />
          </div>
          <button type="submit" className="btn btn-success btn-block">
            Tìm kiếm
          </button>
        </form>
        <h2>
          Ưu đãi GrabFood tại 182 Lã Xuân Oai, P.Tăng Nhơn Phú A, Tp. Thủ Đức
        </h2>
        <div className="row">
          {listFood.map((promo, index) => (
            <div
              className="col-md-3 cursor-pointer"
              key={index}
              onClick={() => handleDetail(promo.id)}
            >
              <div className="card mb-4">
                <span className="promo-badge">Promo</span>
                <img className="card-img-top" src={Pizza} />
                <div className="card-body">
                  <h5 className="card-title">Bếp nhà: {promo.name}</h5>
                  <p className="card-text">
                    <span>⭐ {promo.score}</span> • {} • địa chỉ :{" "}
                    {promo.address}
                    <br />
                    {}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-outline-secondary btn-block">
          See all promotions
        </button>
      </div>
      <div className="container mt-5">
        <h2>There's something for everyone!</h2>
        <div className="row">
          {categories.map((category, index) => (
            <div className="col-md-3 mb-4" key={index}>
              <div className="card">
                <img
                  className="card-img-top"
                  src={category.imageUrl}
                  alt={category.title}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{category.title}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container mt-5">
        <h2>Vì sao bạn nên Order trên Homee?</h2>
        <ul>
          <li>
            <strong>Nhanh nhất</strong> - Homee cung cấp dịch vụ giao đồ ăn
            nhanh nhất thị trường.
          </li>
          <li>
            <strong>Dễ dàng nhất</strong> - Giờ đây, bạn chỉ cần thực hiện vài
            cú nhấp chuột hoặc chạm nhẹ là đã có thể đặt đồ ăn. Hãy đặt đồ ăn
            trực tuyến hoặc tải xuống siêu ứng dụng Grab của chúng tôi để có
            trải nghiệm nhanh hơn và thú vị hơn.
          </li>
          <li>
            <strong>Đáp ứng mọi nhu cầu</strong> - Từ món ăn đặc sản địa phương
            đến các nhà hàng được ưa thích, nhiều lựa chọn đa dạng chắc chắn sẽ
            luôn làm hài lòng khẩu vị của bạn.
          </li>
          <li>
            <strong>Thanh toán dễ dàng</strong> - Giao và nhận đồ ăn thật dễ
            dàng. Thanh toán bằng ZaloPay thậm chí còn dễ dàng hơn nữa.
          </li>
          <li>
            <strong>Nhiều quà tặng hơn</strong> - Tích điểm HomeeRewards cho mỗi
            đơn hàng của bạn và sử dụng điểm thưởng để đổi lấy nhiều ưu đãi hơn.
          </li>
        </ul>
      </div>
      <div className="container mt-5">
        <h2>Những câu hỏi thường gặp</h2>
        <h5>Homee là gì?</h5>
        <p>
          Lunch, Bún Cá Chấm Góc Đa - Vũ Thạnh for Dinner! We are here to
          satisfy your hunger with a wide selection of merchant partners in
          Vietnam. Homee là dịch vụ Giao đồ ăn nhanh nhất tại Việt Nam. Chúng
          tôi đã sắp xếp tất cả các món ăn, nhà hàng và thực phẩm yêu thích của
          bạn một cách hợp lý để giúp bạn tìm được đồ ăn dễ dàng và nhanh chóng
          nhất có thể. Tìm và đặt món ăn yêu thích trên khắp Việt Nam - đặt đồ
          ăn trực tuyến chỉ bằng vài thao tác, từ món Lifted Coffee & Brunch cho
          bữa sáng, đến Maazi Indian - Nhà Hàng Ấn Độ cho bữa trưa, đến Bún Cá
          Chấm Góc Đa – Vũ Thạnh cho bữa tối! Hãy để chúng tôi xua tan cơn đói
          của bạn nhờ một loạt đối tác bán đồ ăn ở Việt Nam.
        </p>
        <button className="btn btn-outline-secondary btn-block">
          Read More
        </button>
      </div>
    </div>
  );
};

export default UserMainPage;
