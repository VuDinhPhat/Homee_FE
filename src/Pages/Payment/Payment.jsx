import "./Payment.css"; // Import your CSS file for styling
import apiUserInstance from "../../service/api-user";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";

import Logo from "../../assets/logo.png";

import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Cookies from "js-cookie";

const Payment = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState({});
  const [cartList, setCartList] = useState([]);
  const [total, setTotal] = useState(0);
  const [chef, setChef] = useState({});
  const [formData, setFormData] = useState({
    restaurantName: "Pizza Chicago 24H - Mỳ Ý & Ăn Vặt",
    deliveryTime: "20 min (1,8 km away)",
    address: "69 Lo Lu St, P. Tương Bình Hiệp, Thị Thủ Dầu Một, Bình Dương",
    detailedAddress: "",
    driverNotes: "",
    paymentMethod: "point",
    profile: "",
    promoCode: "",
  });

  const [listUser, setListUser] = useState({});
  const [items, setItems] = useState([
    { id: 1, name: "Pizza Margherita", price: 50000, quantity: 1 },
    { id: 2, name: "Spaghetti Carbonara", price: 70000, quantity: 1 },
  ]);

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

  const apiChef = axios.create({
    baseURL: "http://206.189.95.158/api/Chefs",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  const apiUser = axios.create({
    baseURL: "http://206.189.95.158/api/Users",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  const apiOrder = axios.create({
    baseURL: "http://206.189.95.158/api/Orders",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  const apiOrderDetail = axios.create({
    baseURL: "http://206.189.95.158/api/OrderDetails",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  const apiPayment = axios.create({
    baseURL: "http://206.189.95.158/api/Payments",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  const handleLogout = async () => {
    setCookie("userrole", "", 0);
    setCookie("username", "", 0);
    setCookie("usernamereal", "", 0);
    navigate("/detail");
  };

  const handleLogIn = async () => {
    navigate("/login");
  };

  const handleTest = async () => {};

  const handleRegister = async () => {
    navigate("/register");
  };

  const BackMainPage = async () => {
    navigate("/");
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async () => {
    if (formData.detailedAddress !== undefined) {
      if (formData.paymentMethod == "cash") {
        console.log("Form submitted:", formData);
        let id = 0;

        const cookieData2 = Cookies.get("ArrayFood");

        const orderResponse = await apiOrder.post("", {
          id: 0,
          chefId: chef.id,
          deliveryAddress: formData.detailedAddress,
          orderPrice: 20000,
          quantity: 1,
          userId: user.id,
          status: "Awaiting",
          orderDate: new Date(),
        });

        const orderId = orderResponse.data.payload.id;
        console.log(orderResponse.data.payload);

        // Tạo chi tiết đơn hàng cho từng món trong giỏ hàng
        for (const item of cartList) {
          await apiOrderDetail.post("", {
            id: 0,
            foodId: item.id,
            price: item.sellPrice,
            quantity: 1,
            orderId: orderId,
            status: "true",
          });
        }

        // Gán giá trị id của đơn hàng
        id = orderId;

        let tmp = {};
        await apiPayment
          .post("", {
            id: 0,
            orderId: id,
            paymentDate: new Date(),
            totalPrice: 1000,
            paymentType: formData.paymentMethod,
            discount: 1,
            userId: user.id,
            status: "Awaiting",
          })
          .then((response) => {
            tmp = response.data.payload;
          });

        apiPayment
          .put("/" + tmp.id, {
            id: tmp.id,
            orderId: tmp.orderId,
            paymentDate: tmp.paymentDate,
            totalPrice: total,
            paymentType: tmp.paymentType,
            discount: 10,
            userId: tmp.userId,
            status: tmp.status,
          })
          .then((response) => {});

        alert("tạo đơn hàng thành công");
        Cookies.set("ArrayFood", "", { expires: 7 });
        navigate("/usermain");
      }

      if (formData.paymentMethod == "point") {
        if (user.money >= total) {
          console.log("Form submitted:", formData);
          let id = 0;

          const cookieData2 = Cookies.get("ArrayFood");

          const orderResponse = await apiOrder.post("", {
            id: 0,
            chefId: chef.id,
            deliveryAddress: formData.detailedAddress,
            orderPrice: 20000,
            quantity: 1,
            userId: user.id,
            status: "Awaiting",
            orderDate: new Date(),
          });

          const orderId = orderResponse.data.payload.id;
          console.log(orderResponse.data.payload);

          // Tạo chi tiết đơn hàng cho từng món trong giỏ hàng
          for (const item of cartList) {
            await apiOrderDetail.post("", {
              id: 0,
              foodId: item.id,
              price: item.sellPrice,
              quantity: 1,
              orderId: orderId,
              status: "true",
            });
          }

          // Gán giá trị id của đơn hàng
          id = orderId;

          let tmp = {};
          await apiPayment
            .post("", {
              id: 0,
              orderId: id,
              paymentDate: new Date(),
              totalPrice: 1000,
              paymentType: formData.paymentMethod,
              discount: 1,
              userId: user.id,
              status: "Awaiting",
            })
            .then((response) => {
              tmp = response.data.payload;
            });

          apiPayment
            .put("/" + tmp.id, {
              id: tmp.id,
              orderId: tmp.orderId,
              paymentDate: tmp.paymentDate,
              totalPrice: total,
              paymentType: tmp.paymentType,
              discount: 10,
              userId: tmp.userId,
              status: tmp.status,
            })
            .then((response) => {});

          apiUser
            .put("/" + user.id, {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              password: user.password,
              phone: user.phone,
              address: user.address,
              dob: user.dob,
              gender: user.gender,
              avatar: user.avatar,
              roleId: user.roleId,
              status: user.status,
              money: user.money - total,
              discount: user.discount,
            })
            .then((respone) => {});

          alert("tạo đơn hàng thành công");
          Cookies.set("ArrayFood", "", { expires: 7 });
          navigate("/usermain");
        } else {
          alert(
            "bạn thông đủ tiền trong tài khoản để thanh toán bàng homee point"
          );
        }
      }
    } else {
      alert("Bạn chưa điền chi tiết địa chỉ !!!");
    }
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

  useEffect(() => {
    if (Cookies.get("ArrayFood") == "") {
      navigate("/");
      return;
    }
    if (getCookie("username") == "") {
      navigate("/");
    }

    setUsername(getCookie("usernamereal"));

    if (getCookie("username") !== "") {
      apiUser.get("/" + getCookie("username")).then((response) => {
        setUser(response.data.payload);
      });
    }
    let id = 0;

    const cookieData = Cookies.get("ArrayFood");

    if (cookieData) {
      const parsedData = JSON.parse(cookieData);
      setCartList(parsedData);
      console.log(cartList);

      let tmp = 20000;
      parsedData.forEach((item) => {
        tmp = tmp + item.sellPrice;
        id = item.chefId;
      });
      setTotal(tmp);
    }

    apiChef.get("/" + id).then(async (response) => {
      await setChef(response.data.payload);
      console.log(response.data.payload);
    });

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

  const renderData = () => {
    if (getCookie("username") !== "") {
      return (
        <div className="flex items-center justify-between h-[150px] w-[70%] shadow-lg px-[25px]">
          <div className="cursor-pointer" onClick={BackMainPage}>
            <img src={Logo} alt="" width={150} height={150} />
          </div>
          <div className="flex items-center rounded-[5px]"></div>
          <div className="flex items-center gap-[15px] relative">
            <div className="cursor-pointer flex items-center gap-[25px] border-r-[1px] pr-[25px]">
              Money : {user.money}
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
            <div className="cursor-pointer flex items-center gap-[25px] border-r-[1px] pr-[25px]">
              Money : {user.money}
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

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-body">
                <h1 className="card-title">Giao đến</h1>
                <form>
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
                          required
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
                      <option value="point">Homee Point</option>
                      <option value="cash">Tiền mặt</option>
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
                      <button
                        type="button"
                        className="btn btn-primary ml-2"
                        onClick={handleTest}
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow" key={"123"}>
              <div className="card-body">
                <h2 className="card-title">Món Ăn</h2>
                {cartList.map((item, index) => (
                  <div className="flex flex-row justify-between">
                    <div className="form-group mr-4">
                      <label className="block text-gray-700 font-bold mb-2">
                        Món ăn: {item.name}
                      </label>
                    </div>
                    <div className="form-group mr-2">
                      <label className="block text-gray-700 font-bold mb-2">
                        Giá: {item.sellPrice}
                      </label>
                    </div>

                    <div className="form-group mr-20">
                      <label className="block text-gray-700 font-bold mb-2">
                        Bếp nhà : {chef.name}
                      </label>
                    </div>
                  </div>
                ))}
                <div className="flex flex-row justify-between">
                  <div className="form-group mr-4">
                    <label className="block text-gray-700 font-bold mb-2">
                      Phí giao hàng : 20.000 ₫
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="card-title mb-0">Tổng cộng: {total} ₫</h2>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  onClick={handleSubmit}
                >
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
