import React, { useEffect, useState } from "react";
import { BsBagHeart } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logocochu.png";
import axios from "axios";
import Cookies from "js-cookie";
import Footer from "../Footer/Footer";
const ChefMain = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [listFood, setListFood] = useState([]);
  const [cartList, setCartList] = useState([]);
  const [user, setUser] = useState({});
  const [categories, setCategories] = useState({});
  const [showAddFoodForm, setShowAddFoodForm] = useState(false);
  const [showEditFoodForm, setShowEditFoodForm] = useState(false);
  const chefId = getCookie("username");
  const [foodData, setFoodData] = useState({
    id: 0,
    name: "",
    image: "",
    foodType: "",
    price: 0,
    sellPrice: 0,
    sellCount: 0,
    status: "",
    categoryId: 0,
    chefId: chefId ? parseInt(chefId) : 0,

    money: 0,
  });

  const [editingFoodData, setEditingFoodData] = useState(null);

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
    // setUsername(getCookie("usernamereal"));
  };

  const api = axios.create({
    baseURL: "https://api.homee.id.vn/api/Foods",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  const handleProfile = async () => {
    navigate("/profilechef");
  };

  const handleLogIn = async () => {
    navigate("/login");
  };

  const handleRegister = async () => {
    navigate("/register");
  };

  const HandlePayment = async () => {
    if (getCookie("username") !== "") {
      navigate("/payment");
    }
  };

  const handleDetail = async (data) => {
    setCookie("chefid", data, 10);
    navigate("/detail");
  };

  const handleOrder = async () => {
    navigate("/orderchef");
  };

  const BackMainPage = async () => {
    navigate("/chefmain");
  };

  useEffect(() => {
    setUsername(getCookie("usernamereal"));
    if (getCookie("username") === "") {
      navigate("/");
    }
    const cookieData = Cookies.get("ArrayFood");
    if (cookieData) {
      const parsedData = JSON.parse(cookieData);
      setCartList(parsedData);
    }
    const chefId = getCookie("username");
    api
      .get(`/by-chef?chefId=${chefId}`)
      .then((response) => {
        setListFood(response.data.payload);
      })
      .catch((error) => {});

    // Call API to get chef info
    const fetchCheft = async () => {
      const respone = await axios.get(
        `https://api.homee.id.vn/api/Chefs/${chefId}`
      );
      setUser(respone.data.payload);
      console.log(respone.data.payload);
    };

    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://api.homee.id.vn/api/Categories"
        );
        setCategories(response.data.payload); // Update categories state with fetched data
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCheft();
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFoodData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/", foodData);
      setListFood([...listFood, response.data]);
      setShowAddFoodForm(false);
    } catch (error) {
      console.error("Error adding food item:", error);
    }
  };

  const handleEditFood = (food) => {
    setEditingFoodData(food);
    setShowEditFoodForm(true);
  };

  const handleUpdateFood = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/${editingFoodData.id}`, editingFoodData);
      setListFood((prevList) =>
        prevList.map((food) =>
          food.id === editingFoodData.id ? response.data : food
        )
      );
      setShowEditFoodForm(false);
      setEditingFoodData(null);
    } catch (error) {
      console.error("Error updating food item:", error);
    }
  };

  const handleTopup = async (data) => {
    navigate("/topupchef");
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingFoodData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeleteFood = async (id) => {
    try {
      await api.delete(`/${id}`);
      setListFood((prevList) => prevList.filter((food) => food.id !== id));
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };

  return (
    <div>
      {getCookie("username") !== "" ? (
        <div className="flex items-center justify-between h-[150px] w-[100%] shadow-lg px-[155px]">
          <div className="cursor-pointer" onClick={BackMainPage}>
            <img src={Logo} alt="" width={150} height={150} />
          </div>
          <div className="flex items-center rounded-[5px]"></div>
          <div className="flex items-center gap-[15px] relative">
            <div className="cursor-pointer flex items-center gap-[25px] border-r-[1px] pr-[25px]">
              Tiền: {user.money}
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
        </div>
      ) : (
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
      )}

      <div className="relative pb-[0px]">
        {" "}
        {/* Adjust padding-bottom */}
        <div className="flex items-center justify-center">{}</div>
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
      </div>

      <div className="container mx-auto ">
        <div className="px-[50px]">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => setShowAddFoodForm(!showAddFoodForm)}
          >
            {showAddFoodForm ? "Đóng" : "Thêm thức ăn"}
          </button>

          {showAddFoodForm && (
            <form
              className="bg-white p-4 rounded shadow-md mt-4"
              onSubmit={handleAddFood}
            >
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tên món ăn
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={foodData.name}
                  onChange={handleInputChange}
                  className="border p-2 w-full mb-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Hình ảnh
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  placeholder="Image URL"
                  value={foodData.image}
                  onChange={handleInputChange}
                  className="border p-2 w-full mb-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="foodType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Thể loại
                </label>
                <input
                  type="text"
                  id="foodType"
                  name="foodType"
                  placeholder="Food Type"
                  value={foodData.foodType}
                  onChange={handleInputChange}
                  className="border p-2 w-full mb-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Giá
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  value={foodData.price}
                  onChange={handleInputChange}
                  className="border p-2 w-full mb-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="sellPrice"
                  className="block text-sm font-medium text-gray-700"
                >
                  Giá thực
                </label>
                <input
                  type="number"
                  id="sellPrice"
                  name="sellPrice"
                  placeholder="Sell Price"
                  value={foodData.sellPrice}
                  onChange={handleInputChange}
                  className="border p-2 w-full mb-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="sellCount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Giá giảm
                </label>
                <input
                  type="number"
                  id="sellCount"
                  name="sellCount"
                  placeholder="Sell Count"
                  value={foodData.sellCount}
                  onChange={handleInputChange}
                  className="border p-2 w-full mb-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <input
                  type="text"
                  id="status"
                  name="status"
                  placeholder="Status"
                  value={foodData.status}
                  onChange={handleInputChange}
                  className="border p-2 w-full mb-2"
                />
              </div>
              <div>
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phân loại
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={foodData.categoryId}
                  onChange={handleInputChange}
                  className="border p-2 w-full mb-2"
                >
                  <option value="">Chọn kiểu thức ăn</option>
                  {categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Thêm thức ăn
              </button>
            </form>
          )}

          {showEditFoodForm && (
            <form
              className="bg-white p-4 rounded shadow-md mt-4"
              onSubmit={handleUpdateFood}
            >
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tên
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={editingFoodData.name}
                  onChange={handleEditInputChange}
                  className="border p-2 w-full mb-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Hình ảnh
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  placeholder="Image URL"
                  value={editingFoodData.image}
                  onChange={handleEditInputChange}
                  className="border p-2 w-full mb-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="foodType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Kiểu thức ăn
                </label>
                <input
                  type="text"
                  id="foodType"
                  name="foodType"
                  placeholder="Food Type"
                  value={editingFoodData.foodType}
                  onChange={handleEditInputChange}
                  className="border p-2 w-full mb-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Giá
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  value={editingFoodData.price}
                  onChange={handleEditInputChange}
                  className="border p-2 w-full mb-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="sellPrice"
                  className="block text-sm font-medium text-gray-700"
                >
                  Giá thực
                </label>
                <input
                  type="number"
                  id="sellPrice"
                  name="sellPrice"
                  placeholder="Sell Price"
                  value={editingFoodData.sellPrice}
                  onChange={handleEditInputChange}
                  className="border p-2 w-full mb-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="sellCount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Giá giảm
                </label>
                <input
                  type="number"
                  id="sellCount"
                  name="sellCount"
                  placeholder="Sell Count"
                  value={editingFoodData.sellCount}
                  onChange={handleEditInputChange}
                  className="border p-2 w-full mb-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Trạng thái
                </label>
                <input
                  type="text"
                  id="status"
                  name="status"
                  placeholder="Status"
                  value={editingFoodData.status}
                  onChange={handleEditInputChange}
                  className="border p-2 w-full mb-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phân loại
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={editingFoodData.categoryId}
                  onChange={handleInputChange}
                  className="border p-2 w-full mb-2"
                >
                  <option value="">Chọn kiểu thức ăn</option>
                  {categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Chỉnh sửa
              </button>
              <button
                type="button"
                className="bg-red-500 text-white py-2 px-4 rounded ml-2"
                onClick={() => setShowEditFoodForm(false)}
              >
                Huỷ
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {listFood.map((food) => (
              <div
                key={food.id}
                className="bg-white shadow-md rounded-lg p-4 mb-4 relative"
              >
                <div className="mt-2">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="h-40 w-full object-cover"
                  />
                </div>
                <div className="mt-4 text-left">
                  <p>
                    <strong>Tên thức ăn:</strong> {food.name}
                  </p>
                  <p>
                    <strong>Thể loại:</strong> {food.foodType}
                  </p>
                  <p>
                    <strong>Giá:</strong> {food.price}
                  </p>
                  <p>
                    <strong>Giá thực tế:</strong> {food.sellPrice}
                  </p>
                  <p>
                    <strong>Giá giảm:</strong> {food.sellCount}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong> {food.status}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 w-full text-center mb-1">
                  <div className="mx-auto mt-2">
                    <button
                      className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
                      onClick={() => handleEditFood(food)}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-2 rounded ml-2"
                      onClick={() => handleDeleteFood(food.id)}
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: "auto" }}>
        <Footer />
      </div>
    </div>
  );
};

export default ChefMain;
