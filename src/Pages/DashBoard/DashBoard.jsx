import React, { useEffect, useState } from "react";
import { BsBagHeart } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import axios from "axios";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";

const DashBoard = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [flag, setFlag] = useState("");
  const [listTopup, setListTopup] = useState([]);
  const [listTopupComplete, setListTopupComplete] = useState([]);
  const chefId = getCookie("username");

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
    navigate("/login");
    // setUsername(getCookie("usernamereal"));
  };

  const apiTopUp = axios.create({
    baseURL: "https://206.189.95.158/api/TopUpRequest",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  const apiUsers = axios.create({
    baseURL: "https://206.189.95.158/api/Users",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  const handleProfile = async () => {};

  const handleLogIn = async () => {
    navigate("/login");
  };

  const handleRegister = async () => {};

  const BackMainPage = async () => {};

  const Dashboard = (data) => {
    setFlag("Dashboard");
  };

  const TopUp = (data) => {
    setFlag("TopUp");
  };
  const TopUpComplete = (data) => {
    setFlag("TopUpComplete");
  };

  const Approved = async (data) => {
    await apiTopUp.put("/approve/" + data).then((respone) => {
      console.log(respone);
    });
    await apiTopUp.get("?pageIndex=1&pageSize=100").then((response) => {
      let tmp = [];
      let tmp2 = [];
      response.data.payload.map((item) => {
        if (item.isApproved == false) {
          tmp.push(item);
        } else {
          tmp2.push(item);
        }
      });
      setListTopup(tmp);
      setListTopupComplete(tmp2);
    });
    alert("Confirm Success");
  };

  useEffect(() => {
    setUsername(getCookie("usernamereal"));
    if (getCookie("username") == "") {
      navigate("/");
    }
    if (getCookie("userrole") !== "2") {
      navigate("/");
    }
    apiTopUp.get("?pageIndex=1&pageSize=100").then((response) => {
      let tmp = [];
      let tmp2 = [];
      response.data.payload.map((item) => {
        if (item.isApproved == false) {
          tmp.push(item);
        } else {
          tmp2.push(item);
        }
      });
      setListTopup(tmp);
      setListTopupComplete(tmp2);
    });
  }, []);

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
              <div style={{ height: "30px", width: "30px" }}>
                <BsBagHeart style={{ height: "100%", width: "100%" }} />
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
      <div className="container mt-5">
        <button
          className="bg-green-500 hover:bg-green-700 text-white px-6 py-4 rounded-md text-xs mr-4"
          onClick={() => Dashboard("Success")}
        >
          DashBoard
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white px-6 py-4 rounded-md text-xs mr-4"
          onClick={() => TopUp("Cancel")}
        >
          Confirm TopUp
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white px-6 py-4 rounded-md text-xs mr-4"
          onClick={() => TopUpComplete("Cancel")}
        >
          TopUp Complete
        </button>
        {flag == "Dashboard" ? (
          <div>
            <div>DashBoard</div>
          </div>
        ) : (
          <div></div>
        )}

        {flag == "TopUp" ? (
          <div>
            <div>TopUp</div>
            <thead>
              <tr>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Amount</th>
                <th className="py-2 px-4 border">Request Date</th>
                <th className="py-2 px-4 border">Is Approved</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {listTopup.map((order) => (
                <tr key={order.id}>
                  <td className="py-2 px-4 border">{order.id}</td>
                  <td className="py-2 px-4 border">{order.amount}</td>
                  <td className="py-2 px-4 border">{order.requestDate}</td>
                  <td className="py-2 px-4 border">
                    <button className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-md text-xs mr-2">
                      Not Approved
                    </button>
                  </td>
                  <td className="py-2 px-4 border">
                    <>
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded-md text-xs mr-2"
                        onClick={() => Approved(order.id, "Success")}
                      >
                        Approved
                      </button>
                    </>
                  </td>
                </tr>
              ))}
            </tbody>
          </div>
        ) : (
          <div></div>
        )}

        {flag == "TopUpComplete" ? (
          <div>
            <div>TopUp</div>
            <thead>
              <tr>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Amount</th>
                <th className="py-2 px-4 border">Request Date</th>
                <th className="py-2 px-4 border">Is Approved</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {listTopupComplete.map((order) => (
                <tr key={order.id}>
                  <td className="py-2 px-4 border">{order.id}</td>
                  <td className="py-2 px-4 border">{order.amount}</td>
                  <td className="py-2 px-4 border">{order.requestDate}</td>
                  <td className="py-2 px-4 border">
                    <button className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded-md text-xs mr-2">
                      Approve
                    </button>
                  </td>

                  <td className="py-2 px-4 border">
                    <></>
                  </td>
                </tr>
              ))}
            </tbody>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
