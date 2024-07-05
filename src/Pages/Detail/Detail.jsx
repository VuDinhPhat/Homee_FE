import React, { useEffect, useState, useRef } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { BsBagHeart } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import LoginBG from '../../assets/Lgbg.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaStar, FaRegCalendarAlt } from 'react-icons/fa';
import apiFoodInstance from '../../service/api-food';
import { CiClock1 } from 'react-icons/ci';
import Payment from '../Payment/Payment';


const Detail = () => {
  const [username, setUsername] = useState('');
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [listFood, setListFood] = useState([]);
  const yellowColor = '#fde047';
  const todayPromotionRef = useRef(null);
  const mrcDealRef = useRef(null);
  const overflowingPromotionRef = useRef(null);
  const interestingFoodsRef = useRef(null);

  const scrollToRef = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    var expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + '; ' + expires;
  }

  const handlePayMent = async () => {
    navigate('/payment');
  }
  const handleLogout = async () => {
    setCookie('username', '', 0);
    navigate('/login');
  };

  const handleLogIn = async () => {
    navigate('/login');
  };

  const handleRegister = async () => {
    navigate('/register');
  };

  function getCookie(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  useEffect(() => {
    setUsername(getCookie('username'));
    apiFoodInstance.get("?pageIndex=1&pageSize=10").then((respon)=>{
      setListFood(respon.data.payload);
    });
  }, []);

  const renderData = () => {
    if (getCookie('username') !== '') {
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
            <div className="flex items-center gap-[10px] relative" onClick={showDropDown}>
              <p>{username}</p>
              <div className="w-[40px] h-[40px] rounded-full bg-[#4E73DF] cursor-pointer flex items-center justify-center relative">
                <img src="" alt="" />
              </div>
              {open && (
                <div className="bg-white border h-[120px] w-[150px] absolute bottom-[-135px] z-20 right-0 pt-[15px] pl-[15px] space-y-[10px]">
                  <p className="cursor-pointer hover:text-[blue] font-semibold">Profile</p>
                  <p className="cursor-pointer hover:text-[blue] font-semibold" onClick={handleLogout}>
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
            <div className="cursor-pointer flex items-center gap-[25px] border-r-[1px] pr-[25px]" onClick={toggleCart}>
              <BsBagHeart height={150} width={150} />
            </div>
            <div className="flex items-center gap-[10px] relative" onClick={showDropDown}>
              <p>{username}</p>
              <div onClick={handleLogIn} className="cursor-pointer flex items-center justify-center relative">
                Đăng nhập
                <img src="" alt="" />
              </div>
              <div onClick={handleRegister} className="cursor-pointer flex items-center justify-center relative">
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
      {isOpen && (
        <div className="fixed inset-0 flex justify-end z-30">
          <div className="h-full w-[30%] shadow-lg px-[25px] bg-white">
            <div className="border-b-[2px] border-black">
              <h1 className="flex justify-center">Giỏ hàng</h1>
              <h5 className="flex justify-center">Thời gian giao: 15 phút (Cách bạn 1.5km)</h5>
            </div>
            <div className="">
              <h1>Tên quán ăn</h1>
              <br />
              <div className="flex items-center justify-center border-b-[2px] border-black h-[70px]">
                <div className="w-[5%] text-blue text-[40px] cursor-pointer">-</div>
                <div className="w-[5%] text-[30px]">1</div>
                <div className="w-[5%] text-blue text-[40px] cursor-pointer">+</div>
                <div className="w-[40%]">Combo gà rán kfc</div>
                <div className="w-[20%]">50.000</div>
                <div className="border-[2px] border-black text-red">
                  <button>Remove</button>
                </div>
              </div>
              <br />
              <div className="flex items-center justify-center border-b-[2px] border-black h-[70px]">
                <div className="w-[5%] text-blue text-[40px] cursor-pointer">-</div>
                <div className="w-[5%] text-[30px]">2</div>
                <div className="w-[5%] text-blue text-[40px] cursor-pointer">+</div>
                <div className="w-[40%]">Combo gà rán kfc</div>
                <div className="w-[20%]">50.000</div>
                <div className="border-[2px] border-black text-red">
                  <button>Remove</button>
                </div>
              </div>
              <br />
              <div className="flex items-center justify-center border-b-[2px] border-black h-[70px]">
                <div className="w-[5%] text-blue text-[40px] cursor-pointer">-</div>
                <div className="w-[5%] text-[30px]">3</div>
                <div className="w-[5%] text-blue text-[40px] cursor-pointer">+</div>
                <div className="w-[40%]">Combo gà rán kfc</div>
                <div className="w-[20%]">50.000</div>
                <div className="border-[2px] border-black text-red">
                  <button>Remove</button>
                </div>
              </div>
              <br />
              <div className="flex border-b-[2px] border-black h-[70px]">
                <div>
                  <h1>Tổng đơn</h1>
                  <h1>70.000</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-4xl font-bold pt-6 pl-[60px]">Chi tiết sản phẩm</div>
      <div className="h-full flex mt-10 mx-10">
        {listFood.length !== 0 ? (
          listFood.map((item, index) => (
            <div key={index} className="w-1/2 bg-gray-100 flex flex-col justify-center items-center rounded-lg shadow-md">
              <img src={LoginBG} alt="Sản phẩm" className="w-3/4 h-3/4 object-cover" />
              <div className="w-1/2 p-10">
                <h1 className="text-2xl font-bold">{item.name}</h1>
                <p className="mt-4">{item.description}</p>
                <p className="mt-4">Giá: {item.price} VND</p>
                <p className="mt-4">Giá khuyến mãi: {item.sellPrice} VND</p>
                <Button className="mt-4" variant="primary">Thêm vào giỏ hàng</Button>
              </div>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào.</p>
        )}
      </div>
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-4">Sản phẩm liên quan</h2>
        <div onClick={handlePayMent} className="cursor-pointer flex items-center justify-center relative">
                <Button>Payment</Button>
                <img src="" alt="" />
              </div>
      </div>
    </div>
  );
};

export default Detail;
