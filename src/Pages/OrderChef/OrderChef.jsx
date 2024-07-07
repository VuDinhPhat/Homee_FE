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
import "bootstrap/dist/css/bootstrap.min.css";
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
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        dob: "",
        gender: "",
        password: ""
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
            setFormData({
                email: response.data.payload.email,
                firstName: response.data.payload.firstName,
                lastName: response.data.payload.lastName,
                phone: response.data.payload.phone,
                address: response.data.payload.address,
                dob: response.data.payload.dob,
                gender: response.data.payload.gender,
                password: response.data.payload.password || ""
            });

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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

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
            password: formData.password
        };

        api.put("/" + getCookie("username"), filteredData)
            .then((response) => {
                setUser(response.data.payload);
                setIsEditing(false);
            })
            .catch((error) => {
                console.error("Update failed:", error);
                console.error("Server error response:", error.response);
            });
    };

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

    const handleProfile = () => navigate("/profile");
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

    const renderData = () => {
        if (getCookie("username") !== "") {
            return (
                <div className="flex items-center justify-between h-[150px] w-[70%] shadow-lg px-[25px]">
                    <div className="cursor-pointer" onClick={BackMainPage}>
                        <img src={Logo} alt="Company Logo" width={150} height={150} /> {/* Added alt prop */}
                    </div>
                    <div className="flex items-center gap-[15px] relative">
                        <div className="cursor-pointer flex items-center gap-[25px] border-r-[1px] pr-[25px]" onClick={toggleCart}>
                            <BsBagHeart height={150} width={150} />
                        </div>
                        <div className="flex items-center gap-[10px] relative" onClick={showDropDown}>
                            <p>{username}</p>
                            <div className="w-[40px] h-[40px] rounded-full bg-[#4E73DF] cursor-pointer flex items-center justify-center relative">
                                <img src="" alt="" />
                            </div>
                            {open && (
                                <div className="bg-white border h-[120px] w-[150px] absolute bottom-[-135px] z-20 right-0 pt-[15px] pl-[15px] space-y-[10px]">
                                    <p className="cursor-pointer hover:text-[blue] font-semibold" onClick={handleProfile}>Profile</p>
                                    <p className="cursor-pointer hover:text-[blue] font-semibold" onClick={handleLogout}>Log out</p>
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
                        <img src={Logo} alt="Company Logo" width={150} height={150} /> {/* Added alt prop */}
                    </div>
                    <div className="flex items-center gap-[15px] relative">
                        <div className="cursor-pointer flex items-center gap-[25px] border-r-[1px] pr-[25px]" onClick={toggleCart}>
                            <BsBagHeart height={150} width={150} />
                        </div>
                        <div className="flex items-center gap-[10px] relative" onClick={showDropDown}>
                            <p>{username}</p>
                            <div onClick={handleLogIn} className="cursor-pointer flex items-center justify-center relative">Đăng nhập</div>
                            <div onClick={handleRegister} className="cursor-pointer flex items-center justify-center relative">/Đăng ký</div>
                        </div>
                    </div>
                </div>
            );
        }
    };

   

    return (
        <div className="container mx-auto p-8">
            <div className="flex items-center justify-center mb-8">{renderData()}</div>
            {isOpen && (
                <div className="fixed inset-0 flex justify-end z-30">
                    <div className="h-full w-[30%] shadow-lg px-6 py-4 bg-white overflow-y-auto relative">
                        <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900" onClick={toggleCart}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
                                <div key={item} className="flex items-center justify-between border-b-2 border-gray-300 py-2">
                                    <div className="flex items-center space-x-4">
                                        <button className="text-blue-600 text-2xl cursor-pointer">-</button>
                                        <span className="text-xl">{item}</span>
                                        <button className="text-blue-600 text-2xl cursor-pointer">+</button>
                                        <span className="text-lg">Combo gà rán kfc</span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-lg">50.000</span>
                                        <button className="text-red-600 border border-red-600 px-2 py-1 rounded">Remove</button>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-semibold">Tổng</h3>
                                    <h3 className="text-xl font-semibold">150.000</h3>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Phí giao hàng sẽ được thêm vào khi bạn thanh toán đơn hàng</p>
                            </div>
                            <div className="flex justify-center mt-6">
                                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">Thanh toán</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-center">
                <div className="bg-white shadow-lg rounded-lg p-6 w-full lg:w-[70%]">
                    <h1 className="text-2xl font-semibold mb-4">Orders</h1>
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
                                <th className="py-2 px-4 border">Actions</th> {/* Added Actions column */}
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
    <button
         className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded-md text-xs"
        onClick={() => viewOrderDetail(order.id)}
    >
        View Detail
    </button>
</td>

{/* Modal for Order Details */}
{orderDetailVisible && (
    <div className={`fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-40`}>
        <div className="bg-white shadow-lg rounded-lg p-6 w-full lg:w-[50%]">
            <h1 className="text-2xl font-semibold mb-4">Order Details</h1>
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">Food ID</th>
                        <th className="py-2 px-4 border">Price</th>
                        <th className="py-2 px-4 border">Quantity</th>
                        <th className="py-2 px-4 border">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedOrderDetails.map((detail, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 border">{detail.foodId}</td>
                            <td className="py-2 px-4 border">{detail.price}</td>
                            <td className="py-2 px-4 border">{detail.quantity}</td>
                            <td className="py-2 px-4 border">{detail.status}</td>
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
        </div>
    );
};


export default OrderChef;