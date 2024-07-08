import React, { useEffect, useState } from "react";
import { BsBagHeart } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import axios from "axios";
import Cookies from "js-cookie";

const ChefMain = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [listFood, setListFood] = useState([]);
  const [cartList, setCartList] = useState([]);
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
    chefId: chefId ? parseInt(chefId) : 0
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
    baseURL: "https://localhost:44388/api/Foods",
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
<div className="container mx-auto ">
  <div className="px-[50px]">
      <h1 className="text-center text-3xl my-4">Chef Main Page</h1>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={() => setShowAddFoodForm(!showAddFoodForm)}
      >
        {showAddFoodForm ? "Close Form" : "Add Food"}
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
              Name
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
              Image URL
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
              Food Type
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
              Price
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
              Sell Price
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
              Sell Count
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
          <div className="mb-4">
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700"
            >
              Category ID
            </label>
            <input
              type="number"
              id="categoryId"
              name="categoryId"
              placeholder="Category ID"
              value={foodData.categoryId}
              onChange={handleInputChange}
              className="border p-2 w-full mb-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Add Food
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
              Name
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
              Image URL
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
              Food Type
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
              Price
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
              Sell Price
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
              Sell Count
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
              Status
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
              Category ID
            </label>
            <input
              type="number"
              id="categoryId"
              name="categoryId"
              placeholder="Category ID"
              value={editingFoodData.categoryId}
              onChange={handleEditInputChange}
              className="border p-2 w-full mb-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Update Food
          </button>
          <button
            type="button"
            className="bg-red-500 text-white py-2 px-4 rounded ml-2"
            onClick={() => setShowEditFoodForm(false)}
          >
            Cancel
          </button>
        </form>
      )}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
  {listFood.map((food) => (
    <div key={food.id} className="bg-white shadow-md rounded-lg p-4 mb-4 relative">
      <div className="mt-2">
        <img src={food.image} alt={food.name} className="h-40 w-full object-cover" />
      </div>
      <div className="mt-4 text-left">
      <p><strong>Name:</strong> {food.name}</p>
        <p><strong>Type:</strong> {food.foodType}</p>
        <p><strong>Price:</strong> {food.price}</p>
        <p><strong>Sell Price:</strong> {food.sellPrice}</p>
        <p><strong>Sell Count:</strong> {food.sellCount}</p>
        <p><strong>Status:</strong> {food.status}</p>
      
      </div>
      <div className="absolute bottom-0 left-0 w-full text-center mb-1">
        <div className="mx-auto mt-2">
          <button
       
            className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
            onClick={() => handleEditFood(food)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white py-1 px-2 rounded ml-2"
            onClick={() => handleDeleteFood(food.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

</div>
</div>

    </div>
  );
};

export default ChefMain;