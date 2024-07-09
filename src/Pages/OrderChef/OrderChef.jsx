import React, { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { BsBagHeart } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import axios from "axios";
import Cookies from "js-cookie";

const OrderChef = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
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
        baseURL: "https://localhost:44388/api/Chefs",
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
            axios.get("https://localhost:44388/api/Orders", {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`
                }
            }).then((orderResponse) => {
                // Filter orders based on user ID
                const userOrders = orderResponse.data.payload.filter(order => order.chefIdId === response.data.payload.chefId);
                setOrders(userOrders);
            }).catch((error) => {
                console.error("Error fetching orders:", error);
            });
        });
    }, []);

    const viewOrderDetail = async (orderId) => {
        try {
            const orderDetailResponse = await axios.get(`https://localhost:44388/api/OrderDetails`, {
              

                headers: {
                    Authorization: `Bearer ${getCookie("token")}`
                }
            });
          
    
            // Filter order details based on orderId
            const userOrdersDetail = orderDetailResponse.data.payload.filter(order => order.orderId === orderId);
           
            // Update state to display order details
            setSelectedOrderDetails(userOrdersDetail);
            setOrderDetailVisible(true); // Show order details modal
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    };
    const BackMainPage = async () => {
        navigate("/chefmain");
      };

    const handleProfile = () => navigate("/profile");
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
            const orderToUpdate = orders.find(order => order.id === orderId);
    
            if (!orderToUpdate) {
                console.error(`Order with ID ${orderId} not found.`);
                return;
            }
    
            // Gọi API để cập nhật đơn hàng
            await axios.put(`https://localhost:44388/api/Orders/${orderId}`, {
                chefId: orderToUpdate.chefId,
                deliveryAddress: orderToUpdate.deliveryAddress,
                orderPrice: orderToUpdate.orderPrice,
                quantity: orderToUpdate.quantity,
                userId: orderToUpdate.userId,
                status: newStatus,
                orderDate: new Date().toISOString()
            }, {
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`
                }
            });
    
            // Cập nhật lại danh sách đơn hàng sau khi cập nhật thành công
            const updatedOrders = orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            );
            setOrders(updatedOrders);
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const renderData = () => {
        if (getCookie("username") !== "") {
            return (
                <div className="flex items-center justify-between h-[150px] w-[100%] shadow-lg px-[150px] pb-[20px]">
                <div className="cursor-pointer" onClick={BackMainPage}>
                  <img src={Logo} alt="" width={150} height={150} />
                </div>
                <div className="flex items-center rounded-[5px]"></div>
                <div className="flex items-center gap-[15px] relative">
                  <div
                    className="cursor-pointer flex items-center gap-[25px] border-r-[1px] pr-[25px]"
                    onClick={toggleCart}
                  >
                    <div style={{ height: '30px', width: '30px' }}>
                      <BsBagHeart style={{ height: '100%', width: '100%' }} />
                    </div>
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
                      Đăng ký
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
            <h1 className="text-2xl font-semibold mb-4">{status} Orders</h1>
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">ID</th>
                        <th className="py-2 px-4 border">Chef ID</th>
                        <th className="py-2 px-4 border">Delivery Address</th>
                        <th className="py-2 px-4 border">Order Price</th>
                        <th className="py-2 px-4 border">Quantity</th>
                        <th className="py-2 px-4 border">User ID</th>
                        <th className="py-2 px-4 border">Status</th>
                        <th className="py-2 px-4 border">Order Date</th>
                        <th className="py-2 px-4 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td className="py-2 px-4 border">{order.id}</td>
                            <td className="py-2 px-4 border">{order.chefId}</td>
                            <td className="py-2 px-4 border">{order.deliveryAddress}</td>
                            <td className="py-2 px-4 border">{order.orderPrice}</td>
                            <td className="py-2 px-4 border">{order.quantity}</td>
                            <td className="py-2 px-4 border">{order.userId}</td>
                            <td className="py-2 px-4 border">{order.status}</td>
                            <td className="py-2 px-4 border">{order.orderDate}</td>
                            <td className="py-2 px-4 border">
                                {status === "Awaiting" ? (
                                    <>
                                        <button
                                            className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded-md text-xs mr-2"
                                            onClick={() => updateOrderStatus(order.id, "Success")}
                                        >
                                            Set Success
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-md text-xs mr-2"
                                            onClick={() => updateOrderStatus(order.id, "Cancel")}
                                        >
                                            Set Cancel
                                        </button>

                                        <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md text-xs"
                                        onClick={() => viewOrderDetail(order.id)}
                                    >
                                        View Detail
                                    </button>

                                    </>
                                ) : (
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md text-xs"
                                        onClick={() => viewOrderDetail(order.id)}
                                    >
                                        View Detail
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
    
            {/* Modal for Order Details */}
            {orderDetailVisible && (
                <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50`}>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-2/3 overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Order Details</h2>
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">ID</th>
                                    <th className="py-2 px-4 border">Order ID</th> 
                                    <th className="py-2 px-4 border">Food ID</th>                                               
                                    <th className="py-2 px-4 border">Price</th>
                                    <th className="py-2 px-4 border">Quantity</th>
                                    <th className="py-2 px-4 border">Status</th>

                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrderDetails.map((detail) => (
                                    <tr key={detail.id}>
                                        <td className="py-2 px-4 border">{detail.id}</td>
                                        <td className="py-2 px-4 border">{detail.orderId}</td>
                                        <td className="py-2 px-4 border">{detail.foodId}</td>
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
        <div className="flex flex-col items-center justify-center w-screen">
            {renderData()}
            {renderOrderTable(orders.filter(order => order.status === "Awaiting"), "Awaiting")}
            {renderOrderTable(orders.filter(order => order.status === "Success"), "Success")}
            {renderOrderTable(orders.filter(order => order.status === "Cancel"), "Cancel")}
        </div>
    );
};

export default OrderChef;
