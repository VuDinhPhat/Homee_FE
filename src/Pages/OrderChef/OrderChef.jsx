import React, { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { BsBagHeart } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logocochu.png";
import axios from "axios";
import Cookies from "js-cookie";
import Footer from "../Footer/Footer";
import Giohang from"../../assets/giohang.png";
const OrderChef = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [chefs, setChefs] = useState({});
  const [users, setUsers] = useState({});
  const [open, setOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [orderDetailVisible, setOrderDetailVisible] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);

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
    baseURL: "https://api.homee.id.vn/api/Chefs",
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
      // Fetch orders for the logged-in user
      axios
        .get("https://api.homee.id.vn/api/Orders?pageIndex=1&pageSize=1000", {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        })
        .then((orderResponse) => {
          // Filter orders based on user ID
          const userOrders = orderResponse.data.payload.filter(
            (order) => order.chefId === response.data.payload.id
          );
          setOrders(userOrders);
          // Fetch chef names for orders
          fetchChefNames(userOrders);
          fetchUserNames(userOrders);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });
    });
  }, []);

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
      const userOrdersDetail = orderDetailResponse.data.payload.filter(
        (order) => order.orderId === orderId
      );

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

      // Cập nhật state để hiển thị chi tiết đơn hàng với tên món ăn và status
      setSelectedOrderDetails(ordersWithFoodNamesAndStatus);
      setOrderDetailVisible(true); // Hiển thị modal chi tiết đơn hàng
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };
  const handleTopup = async (data) => {
    navigate("/topupchef");
  };
  const handleOrder = async (data) => {
    navigate("/orderchef");
  };

  const BackMainPage = async () => {
    navigate("/chefmain");
  };

  const handleProfile = () => navigate("/profilechef");
  const handleLogIn = () => navigate("/login");
  const handleRegister = () => navigate("/register");

  const showDropDown = () => setOpen(!open);
  const handleLogout = () => {
    setCookie("username", "", 0);
    setCookie("usernamereal", "", 0);

    navigate("/");
    setUsername("");
  };

  const toggleCart = () => setIsOpen(!isOpen);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Tìm đơn hàng cần cập nhật từ danh sách orders
      const orderToUpdate = orders.find((order) => order.id === orderId);

      if (!orderToUpdate) {
        console.error(`Order with ID ${orderId} not found.`);
        return;
      }

      // Gọi API để cập nhật đơn hàng
      await axios.put(
        `https://api.homee.id.vn/api/Orders/${orderId}`,
        {
          chefId: orderToUpdate.chefId,
          deliveryAddress: orderToUpdate.deliveryAddress,
          orderPrice: orderToUpdate.orderPrice,
          quantity: orderToUpdate.quantity,
          userId: orderToUpdate.userId,
          status: newStatus,
          orderDate: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      // Cập nhật lại danh sách đơn hàng sau khi cập nhật thành công
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
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
  const renderOrderTable = (orders, status) => (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full lg:w-[70%] mb-8  pb-[20px] mt-[20px]">
      <h1 className="text-2xl font-semibold mb-4">Trạng thái: {status} </h1>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Tên đầu bếp</th>
            <th className="py-2 px-4 border">Địa chỉ giao hàng</th>
            <th className="py-2 px-4 border">Giá</th>
            <th className="py-2 px-4 border">Số lượng</th>
            <th className="py-2 px-4 border">Người đặt</th>
            <th className="py-2 px-4 border">Trạng thái</th>
            <th className="py-2 px-4 border">Ngày đặt</th>
            <th className="py-2 px-4 border">Hành động</th>
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
        {status === "Đang chờ" ? (
          <>
            <button
              className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded-md text-xs mr-2"
              onClick={() => updateOrderStatus(order.id, "Đang chuẩn bị")}
            >
              Đang chuẩn bị
            </button>
      
            <button
              className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-md text-xs mr-2"
              onClick={() => updateOrderStatus(order.id, "Đã huỷ")}
            >
              Đã huỷ
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md text-xs"
              onClick={() => viewOrderDetail(order.id)}
            >
              Xem chi tiết
            </button>
          </>
        ) : status === "Đang chuẩn bị" ? (
          <>
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white px-2 py-1 rounded-md text-xs mr-2"
              onClick={() => updateOrderStatus(order.id, "Đã giao")}
            >
              Đã giao
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-md text-xs mr-2"
              onClick={() => updateOrderStatus(order.id, "Đã huỷ")}
            >
              Đã huỷ
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md text-xs"
              onClick={() => viewOrderDetail(order.id)}
            >
              Xem chi tiết
            </button>
          </>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md text-xs"
            onClick={() => viewOrderDetail(order.id)}
          >
            Xem chi tiết
          </button>
        )}
      </td>
    </tr>
  ))}
</tbody>
      </table>

      {/* Modal for Order Details */}
      {orderDetailVisible && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50`}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-2/3 overflow-auto">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Tên thức ăn</th>
                  <th className="py-2 px-4 border">Giá</th>
                  <th className="py-2 px-4 border">Số lượng</th>
                  <th className="py-2 px-4 border">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrderDetails.map((detail) => (
                  <tr key={detail.id}>
                    <td className="py-2 px-4 border">{detail.foodName}</td>
                    <td className="py-2 px-4 border">{detail.price}</td>
                    <td className="py-2 px-4 border">{detail.quantity}</td>
                    <td className="py-2 px-4 border">{detail.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 mt-4 rounded-md"
              onClick={() => setOrderDetailVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex flex-col items-center justify-center w-screen">
        {renderData()}
        {renderOrderTable(
          orders.filter((order) => order.status === "Đang chờ"),
          "Đang chờ"
        )}
        {renderOrderTable(
          orders.filter((order) => order.status === "Đang chuẩn bị"),
          "Đang chuẩn bị"
        )}
        {renderOrderTable(
          orders.filter((order) => order.status === "Đã giao"),
          "Đã giao"
        )}
        {renderOrderTable(
          orders.filter((order) => order.status === "Đã huỷ"),
          "Đã huỷ"
        )}
      </div>
      <div style={{ marginTop: "auto" }}>
        <Footer />
      </div>
    </div>
  );
};

export default OrderChef;
