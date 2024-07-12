import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsBagHeart } from "react-icons/bs";
import Logo from "../../assets/logocochu.png";
import QRCode from "../../assets/QRCode.png";
import axios from "axios";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import Footer from "../Footer/Footer";

const TopUpChef = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [openQR, setOpenQR] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [orderDetailVisible, setOrderDetailVisible] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [cartList, setCartList] = useState([]);
  const [user, setUser] = useState({});
  const [total, setTotal] = useState(0);
  const [QRID, setQRID] = useState(0);
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data.amount);

    apiTopup
      .post("", {
        chefId: getCookie("username"),
        amount: data.amount,
        requestDate: new Date(),
        isApproved: false,
        approvalDate: new Date(),
      })
      .then((response) => {
        console.log(response.data.payload);
        setQRID(response.data.payload);
      });

    setOpenQR(true);

    // Add your form submission logic here
  };

  const apiUser = axios.create({
    baseURL: "https://localhost:44388/api/Chefs",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  const apiTopup = axios.create({
    baseURL: "https://localhost:44388/api/TopUpRequest",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  useEffect(() => {
    setUsername(getCookie("usernamereal"));
    if (getCookie("username") == "") {
      navigate("/");
    }
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

    if (getCookie("usernamereal") !== "") {
      apiUser.get("/" + getCookie("username")).then((response) => {
        setUser(response.data.payload);
      });
    }
  }, []);

  const handleOrder = async (data) => {
    navigate("/orderchef");
  };

  const handleTopup = async (data) => {
    navigate("/topupchef");
  };

  const handleProfile = () => navigate("/profilechef");
  const handleLogIn = () => navigate("/login");
  const handleRegister = () => navigate("/register");
  const BackMainPage = () => navigate("/chefmain");
  const showDropDown = () => setOpen(!open);
  const handleLogout = () => {
    setCookie("userrole", "", 0);
    setCookie("username", "", 0);
    setCookie("usernamereal", "", 0);
    navigate("/");
    setUsername("");
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

  const toggleCart = () => setIsOpen(!isOpen);

  let renderData = () => {
    if (getCookie("username") !== "") {
      return (
        <div className="flex items-center justify-between h-[150px] w-[100%] shadow-lg px-[155px]">
          <div className="cursor-pointer" onClick={BackMainPage}>
            <img src={Logo} alt="" width={150} height={150} />
          </div>
          <div className="flex items-center rounded-[5px]"></div>
          <div className="flex items-center gap-[15px] relative">
          
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
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-semibold text-center mb-8">
          Nạp tiền vào tài khoản
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto bg-white p-6 shadow-lg rounded-lg"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="amount"
            >
              Số tiền nạp
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              {...register("amount", { required: "Vui lòng nhập số tiền" })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.amount && (
              <p className="text-red-500 text-xs italic">
                {errors.amount.message}
              </p>
            )}
          </div>
          {openQR && (
            <div className="mb-4">
              <img src={QRCode} />
              <br />
              <h5>
                Yêu cầu của bạn đã được gửi lên sever, để hoàn tất giao dịch hãy
                chuyển số tiền bạn đã yêu cầu vào tài khoản của chúng tôi với
                lời nhắn là : "{QRID.id}".
              </h5>
              <h5>
                Sau khi chúng tôi xác nhận, tài khoản của bạn sẽ được cộng tiền.
              </h5>
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Nạp tiền
            </button>
          </div>
        </form>
      </div>
      <Footer/>
    </div>
  );
};

export default TopUpChef;
