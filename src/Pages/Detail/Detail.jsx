import React, { useEffect, useState, useRef } from "react";
import { FaEnvelope } from "react-icons/fa";
import { BsBagHeart } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import LoginBG from "../../assets/Lgbg.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaStar, FaRegCalendarAlt } from "react-icons/fa";

import { CiClock1 } from "react-icons/ci";

const Detail = () => {
  //var n;
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const yellowColor = "#fde047";
  const todayPromotionRef = useRef(null);
  const mrcDealRef = useRef(null);
  const overflowingPromotionRef = useRef(null);
  const interestingFoodsRef = useRef(null);

  const scrollToRef = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  const handleLogout = async () => {
    setCookie("username", "", 0);
    navigate("/login");
  };

  const handleLogIn = async () => {
    navigate("/login");
  };

  const handleRegister = async () => {
    navigate("/register");
  };

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
  const products = [
    {
      id: 1,
      name: "Sữa Thạch Kiwi Kiwi",
      description:
        "Mứt Kiwi + Thạch đào Hình ảnh mang tính chất minh họa sản phẩm",
      price: "25.000",
      img: LoginBG, // Thay đổi bằng đường dẫn đến hình ảnh Kiwi
    },
    {
      id: 2,
      name: "Sữa Thạch Dâu Tây",
      description:
        "Mứt dâu tây + Thạch đào Hình ảnh mang tính chất minh họa sản phẩm",
      price: "25.000",
      img: LoginBG, // Thay đổi bằng đường dẫn đến hình ảnh Dâu Tây
    },
  ];
  useEffect(() => {
    setUsername(getCookie("username"));
  }, []);

  let renderData = () => {
    if (getCookie("username") !== "") {
      return (
        <div className="flex items-center justify-between h-[150px] shadow-lg px-[25px]">
          <div>
            <img src={Logo} alt="" width={150} height={150} />
          </div>
          <div className="flex items-center rounded-[5px]"></div>
          <div className="flex items-center gap-[15px] relative">
            <div className="flex items-center gap-[25px] border-r-[1px] pr-[25px]">
              <FaEnvelope />
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

  return (
    <div className="relative pb-[100px]">
      {" "}
      {/* Adjust padding-bottom */}
      <div className="flex items-center justify-center">{renderData()}</div>
      {isOpen && (
        <div className="fixed inset-0 flex justify-end z-30">
          {" "}
          {/* Fixed and full screen */}
          <div className="h-full w-[30%] shadow-lg px-[25px] bg-white">
            <div className="border-b-[2px] border-black">
              <h1 className="flex justify-center">Giỏ hàng</h1>
              <h5 className="flex justify-center">
                Thời gian giao: 15 phút (Cách bạn 1.5km)
              </h5>
            </div>
            <div className="">
              <h1>Tên quán ăn</h1>
              <br />
              <div className="flex items-center justify-center border-b-[2px] border-black h-[70px]">
                <div className="w-[5%] text-blue text-[40px] cursor-pointer">
                  -
                </div>
                <div className="w-[5%] text-[30px]">1</div>
                <div className="w-[5%] text-blue text-[40px] cursor-pointer">
                  +
                </div>
                <div className="w-[40%]">Combo gà rán kfc</div>
                <div className="w-[20%]">50.000</div>
                <div className="border-[2px] border-black text-red">
                  <button>Remove</button>
                </div>
              </div>
              <br />
              <div className="flex items-center justify-center border-b-[2px] border-black h-[70px]">
                <div className="w-[5%] text-blue text-[40px] cursor-pointer">
                  -
                </div>
                <div className="w-[5%] text-[30px]">2</div>
                <div className="w-[5%] text-blue text-[40px] cursor-pointer">
                  +
                </div>
                <div className="w-[40%]">Combo gà rán kfc</div>
                <div className="w-[20%]">50.000</div>
                <div className="border-[2px] border-black text-red">
                  <button>Remove</button>
                </div>
              </div>
              <br />
              <div className="flex items-center justify-center border-b-[2px] border-black h-[70px]">
                <div className="w-[5%] text-blue text-[40px] cursor-pointer">
                  -
                </div>
                <div className="w-[5%] text-[30px]">3</div>
                <div className="w-[5%] text-blue text-[40px] cursor-pointer">
                  +
                </div>
                <div className="w-[40%]">Combo gà rán kfc</div>
                <div className="w-[20%]">50.000</div>
                <div className="border-[2px] border-black text-red">
                  <button>Remove</button>
                </div>
              </div>
              <br />
              <div className="flex border-b-[2px] border-black h-[70px]">
                <div>
                  <h1>Tổng</h1>
                  <h1>
                    Phí giao hàng sẽ được thêm vào khi bạn xem lại đơn hàng
                  </h1>
                </div>
                <h1>150.00</h1>
              </div>
            </div>
          </div>
        </div>
      )}
      <Container>
        <div className="flex items-center justify-between mt-5">
          <div>
            <h2>Trang chủ - Nhà hàng - MrC - Cơm Sườn Cay & Cơm Gà</h2>
            <h1 className="font-bold">MrC - Cơm Sườn Cay & Cơm Gà</h1>
            <p>Cơm,Gà</p>
            <div className="flex items-center">
              <FaStar style={{ color: yellowColor }} />
              <p className="ml-2">3.8</p>
            </div>
            <div className="flex items-center">
              <CiClock1 />
              <p className="ml-2">30 phút</p>
            </div>
            <p>Giờ mở cửa</p>
            <p>Hôm nay 10:00-15:00 17:00-22:00</p>
            <p>Tận hưởng ưu đãi</p>
            <p>Ưu đãi đến 130K</p>
            <p>Xem chi tiết</p>
            <div className="flex mt-5">
              <button
                className="border border-green-500 h-[50px] w-[250px] flex items-center justify-center mr-4 bg-customColor"
                onClick={() => scrollToRef(todayPromotionRef)}
              >
                <div className="flex items-center">
                  <FaRegCalendarAlt />
                  <p className="ml-2 mt-3">Ưu đãi hôm nay</p>
                </div>
              </button>
              <button
                className="border border-green-500 h-[50px] w-[250px] flex items-center justify-center mr-4 bg-customColor"
                onClick={() => scrollToRef(mrcDealRef)}
              >
                <div className="flex items-center">
                  <FaRegCalendarAlt />
                  <p className="ml-2 mt-3">MrC khao Deal Lớn</p>
                </div>
              </button>
              <button
                className="border border-green-500 h-[50px] w-[250px] flex items-center justify-center mr-4 bg-customColor"
                onClick={() => scrollToRef(overflowingPromotionRef)}
              >
                <div className="flex items-center">
                  <FaRegCalendarAlt />
                  <p className="ml-2 mt-3">Món ngập tràn ưu đãi</p>
                </div>
              </button>
              <button
                className="border border-green-500 h-[50px] w-[250px] flex items-center justify-center bg-customColor"
                onClick={() => scrollToRef(interestingFoodsRef)}
              >
                <div className="flex items-center">
                  <FaRegCalendarAlt />
                  <p className="ml-2 mt-3">Nhiều món ngon & lạ ở đây</p>
                </div>
              </button>
            </div>

            {/* Phần "Ưu đãi hôm nay" */}
            <div ref={todayPromotionRef}>
              <h1 className="mt-4">Ưu đãi hôm nay</h1>
              <Row>
                {products.map((product) => (
                  <Col key={product.id} sm={12} md={6} lg={4} className="mb-4">
                    <Card>
                      <Card.Img variant="top" src={product.img} />
                      <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>{product.description}</Card.Text>
                        <h5>{product.price}</h5>
                        <Button variant="success">+</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Phần "MrC khao Deal Lớn" */}
            <div ref={mrcDealRef}>
              <h1 className="mt-4">MrC khao Deal Lớn</h1>
              <Row>
                {products.map((product) => (
                  <Col key={product.id} sm={12} md={6} lg={4} className="mb-4">
                    <Card>
                      <Card.Img variant="top" src={product.img} />
                      <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>{product.description}</Card.Text>
                        <h5>{product.price}</h5>
                        <Button variant="success">+</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Phần "Món ngập tràn ưu đãi" */}
            <div ref={overflowingPromotionRef}>
              <h1 className="mt-4">Món ngập tràn ưu đãi</h1>
              <Row>
                {products.map((product) => (
                  <Col key={product.id} sm={12} md={6} lg={4} className="mb-4">
                    <Card>
                      <Card.Img variant="top" src={product.img} />
                      <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>{product.description}</Card.Text>
                        <h5>{product.price}</h5>
                        <Button variant="success">+</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Phần "Nhiều món ngon & lạ ở đây" */}
            <div ref={interestingFoodsRef}>
              <h1 className="mt-4">Nhiều món ngon & lạ ở đây</h1>
              <Row>
                {products.map((product) => (
                  <Col key={product.id} sm={12} md={6} lg={4} className="mb-4">
                    <Card>
                      <Card.Img variant="top" src={product.img} />
                      <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>{product.description}</Card.Text>
                        <h5>{product.price}</h5>
                        <Button variant="success">+</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Detail;
