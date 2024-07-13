import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsBagHeart } from "react-icons/bs";
import Logo from "../../assets/logocochu.png";
import axios from "axios";
import Cookies from "js-cookie";
import Footer from "../Footer/Footer";

const Order = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [orderDetailVisible, setOrderDetailVisible] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [cartList, setCartList] = useState([]);
  const [chefs, setChefs] = useState({});
  const [users, setUsers] = useState({});

  const [total, setTotal] = useState(0);
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
    api.get("/" + getCookie("username")).then(async (response) => {
      setUser(response.data.payload);
      setFormData({
        email: response.data.payload.email,
        firstName: response.data.payload.firstName,
        lastName: response.data.payload.lastName,
        phone: response.data.payload.phone,
        address: response.data.payload.address,
        dob: response.data.payload.dob,
        gender: response.data.payload.gender,
        password: response.data.payload.password || "",
      });

      // Fetch orders for the logged-in user
      axios
        .get("https://api.homee.id.vn/api/Orders", {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        })
        .then((orderResponse) => {
          // Filter orders based on user ID
          const userOrders = orderResponse.data.payload.filter(
            (order) => order.userId === response.data.payload.id
          );
          setOrders(userOrders);

          fetchChefNames(userOrders);
          fetchUserNames(userOrders);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });
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
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleOrder = async (data) => {
    navigate("/order");
  };

  const handleTopup = async (data) => {
    navigate("/topup");
  };

  const handleProfile = () => navigate("/profile");

  const handleSubmit = (event) => {
    event.preventDefault();

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
        setUser(response.data.payload);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Update failed:", error);
        console.error("Server error response:", error.response);
      });
  };

  const fetchChefNames = async (orders) => {
    const chefIds = [...new Set(orders.map((order) => order.chefId))];
    const chefData = {};
    await Promise.all(
      chefIds.map(async (id) => {
        const response = await axios.get(
          `https://api.homee.id.vn/api/Chefs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${getCookie("token")}`,
            },
          }
        );
        chefData[id] = response.data.payload.name;
      })
    );
    setChefs(chefData);
  };
  const fetchUserNames = async (orders) => {
    try {
      // Lấy danh sách các unique userId từ danh sách các đơn hàng
      const userIds = [...new Set(orders.map((order) => order.userId))];

      // Tạo đối tượng để lưu trữ tên của các người dùng với key là userId
      const userData = {};

      // Sử dụng Promise.all để gọi các API lấy tên người dùng bất đồng bộ
      await Promise.all(
        userIds.map(async (id) => {
          const response = await axios.get(
            `https://api.homee.id.vn/api/Users/${id}`,
            {
              headers: {
                Authorization: `Bearer ${getCookie("token")}`,
              },
            }
          );
          // Lưu tên của người dùng vào đối tượng userData
          userData[
            id
          ] = `${response.data.payload.firstName} ${response.data.payload.lastName}`;
        })
      );

      // Cập nhật state users với dữ liệu vừa lấy được
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching user names:", error);
    }
  };

  const viewOrderDetail = async (orderId) => {
    try {
      // Lấy chi tiết đơn hàng từ API /OrderDetails
      const orderDetailResponse = await axios.get(
        `https://api.homee.id.vn/api/OrderDetails?pageIndex=1&pageSize=1000`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      // Lọc chi tiết đơn hàng theo orderId
      const userOrdersDetail = await orderDetailResponse.data.payload.filter(
        (order) => order.orderId == orderId
      );
      console.log(orderDetailResponse.data.payload);

      // Lấy thông tin status từ đơn hàng chính từ API /Orders
      const orderResponse = await axios.get(
        `https://api.homee.id.vn/api/Orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      // Lấy thông tin status từ đơn hàng chính
      const orderStatus = orderResponse.data.payload.status;

      // Lấy danh sách món ăn theo chefId
      const chefId = getCookie("username");
      if (!chefId) {
        navigate("/");
        return;
      }

      // Lấy danh sách món ăn từ API /Foods/by-chef
      const foodsResponse = await axios.get(
        `https://api.homee.id.vn/api/Foods/by-chef?chefId=${chefId}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      // Tạo một map để truy cập nhanh tên món ăn bằng foodId

      const foodMap = {};
      foodsResponse.data.payload.forEach((food) => {
        foodMap[food.id] = food.name;
      });

      // Cập nhật foodName và status vào userOrdersDetail
      const ordersWithFoodNamesAndStatus = userOrdersDetail.map((order) => ({
        ...order,

        foodName: foodMap[order.foodId] || "Unknown Food", // Tên món ăn, mặc định nếu không tìm thấy
        status: orderStatus, // Status từ đơn hàng chính
      }));
      console.log(userOrdersDetail);
      // Cập nhật state để hiển thị chi tiết đơn hàng với tên món ăn và status
      setSelectedOrderDetails(ordersWithFoodNamesAndStatus);
      setOrderDetailVisible(true); // Hiển thị modal chi tiết đơn hàng
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleLogIn = () => navigate("/login");
  const handleRegister = () => navigate("/register");
  const BackMainPage = () => navigate("/");
  const showDropDown = () => setOpen(!open);
  const handleLogout = () => {
    setCookie("username", "", 0);
    setCookie("usernamereal", "", 0);
    navigate("/");
    setUsername("");
  };

  const toggleCart = () => setIsOpen(!isOpen);

  let renderData = () => {
    if (getCookie("username") !== "") {
      return (
        <div className="flex items-center justify-between h-[150px] w-[100%] shadow-lg px-[150px] ">
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
                <div className="bg-white border h-[160px] w-[150px] absolute bottom-[-165px] z-20 right-0 pt-[15px] pl-[15px] space-y-[10px]">
                  <p
                    className="cursor-pointer hover:text-[blue] font-semibold"
                    onClick={handleTopup}
                  >
                    Top up money
                  </p>
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
                    <span className="text-lg">{product.sellPrice} VND</span>
                    <button className="text-red-600 border border-red-600 px-2 py-1 rounded">
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

      <div className="flex items-center justify-center mb-10">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full lg:w-[80%]">
          <h1 className="text-2xl font-semibold mb-4">Orders</h1>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Chef Name</th>
                <th className="py-2 px-4 border">Delivery Address</th>
                <th className="py-2 px-4 border">Order Price</th>
                <th className="py-2 px-4 border">Quantity</th>
                <th className="py-2 px-4 border">User Name</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Order Date</th>
                <th className="py-2 px-4 border">Actions</th>{" "}
                {/* Added Actions column */}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="py-2 px-4 border-b text-center">
                    {chefs[order.chefId] || "Loading..."}
                  </td>

                  <td className="py-2 px-4 border">{order.deliveryAddress}</td>
                  <td className="py-2 px-4 border">{order.orderPrice}</td>
                  <td className="py-2 px-4 border">{order.quantity}</td>
                  <td className="py-2 px-4 border">{users[order.userId]}</td>
                  <td className="py-2 px-4 border">{order.status}</td>
                  <td className="py-2 px-4 border">{order.orderDate}</td>
                  <td className="py-2 px-4 border">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md text-xs"
                      onClick={() => viewOrderDetail(order.id)}
                    >
                      View Detail
                    </button>
                  </td>

                  {/* Modal for Order Details */}
                  {orderDetailVisible && (
                    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-40">
                      <div className="bg-white shadow-lg rounded-lg p-6 w-full lg:max-w-[80%]">
                        <h1 className="text-2xl font-semibold mb-4">
                          Order Details
                        </h1>
                        <table className="min-w-full">
                          <thead>
                            <tr>
                              <th className="py-2 px-4 border">Tên món ăn</th>
                              <th className="py-2 px-4 border">Giá</th>
                              <th className="py-2 px-4 border">Số lượng</th>
                              <th className="py-2 px-4 border">Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrderDetails.map((detail, index) => (
                              <tr key={index}>
                                <td className="py-2 px-4 border">
                                  {detail.foodName}
                                </td>
                                <td className="py-2 px-4 border">
                                  {detail.price}
                                </td>
                                <td className="py-2 px-4 border">
                                  {detail.quantity}
                                </td>
                                <td className="py-2 px-4 border">
                                  {detail.status}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="flex justify-end mt-4">
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                            onClick={() => setOrderDetailVisible(false)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Order;
