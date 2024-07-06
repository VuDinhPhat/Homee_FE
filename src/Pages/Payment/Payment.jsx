import React, { useState, useEffect } from 'react';
import './Payment.css'; // Import your CSS file for styling
import apiUserInstance from '../../service/api-user';

const Payment = () => {
  const [formData, setFormData] = useState({
    restaurantName: 'Pizza Chicago 24H - Mỳ Ý & Ăn Vặt',
    deliveryTime: '20 min (1,8 km away)',
    address: '69 Lo Lu St, P. Tương Bình Hiệp, Thị Thủ Dầu Một, Bình Dương',
    detailedAddress: '',
    driverNotes: '',
    paymentMethod: '',
    profile: '',
    promoCode: ''
  });
  const [listUser, setListUser] = useState([]);
  const [items, setItems] = useState([
    { id: 1, name: 'Pizza Margherita', price: 50000, quantity: 1 },
    { id: 2, name: 'Spaghetti Carbonara', price: 70000, quantity: 1 }
  ]);

  useEffect(() => {
    const storedAddress = getCookie('userAddress');
    apiUserInstance.get("/1").then((response) => {
      const userData = response.data.payload;
      setListUser(userData);
      // Update form data with user's address if stored address not found
      if (!storedAddress) {
        setFormData({
          ...formData,
          address: userData.address,
          detailedAddress: userData.detailedAddress,
          driverNotes: userData.driverNotes
        });
      }
    }).catch(error => {
      console.error('Error fetching user data:', error);
    });
  }, []); // Empty dependency array ensures this effect runs only once

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted:', formData);
    // Implement form submission logic here

    // Set address cookie when form is submitted
    setCookie('userAddress', formData.address, 1); // Set cookie with 1 day expiration
  };

  const applyPromoCode = () => {
    console.log('Promo code applied:', formData.promoCode);
    // Implement promo code application logic here
  };

  const increaseQuantity = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decreaseQuantity = (id) => {
    setItems(items.map(item => (item.id === id && item.quantity > 1) ? { ...item, quantity: item.quantity - 1 } : item));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + '; ' + expires;
  }

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

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="card-title">Giao đến</h1>
              <form onSubmit={handleSubmit}>
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
                      {listUser.length !== 0 ? (
                        listUser.map((item, index) => (
                          <div key={index}>
                            <label htmlFor="address">Địa chỉ:</label>
                            <textarea
                              className="form-control"
                              id="address"
                              name="address"
                              rows="3"
                              value={item.address}
                              onChange={handleChange}
                            />
                          </div>
                        ))
                      ) : (
                        <p>Không có địa chỉ</p>
                      )}
                    </div>  
                    <div className="form-group">
                      <label htmlFor="detailedAddress">Chi tiết địa chỉ:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="detailedAddress"
                        name="detailedAddress"
                        value={formData.detailedAddress}
                        onChange={handleChange}
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
                  <label htmlFor="paymentMethod">Phương thức thanh toán:</label>
                  <select
                    className="form-control"
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="">Chọn phương thức thanh toán</option>
                    <option value="cash">Tiền mặt</option>
                    <option value="creditCard">Thẻ tín dụng</option>
                    <option value="momo">Momo</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="profile">Hồ sơ thẻ:</label>
                  <select
                    className="form-control"
                    id="profile"
                    name="profile"
                    value={formData.profile}
                    onChange={handleChange}
                  >
                    <option value="">Chọn hồ sơ thẻ</option>
                    <option value="person1">Person 1</option>
                    <option value="person2">Person 2</option>
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
                    <button type="button" className="btn btn-primary ml-2">
                      Áp dụng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h2 className="card-title mb-0">Tổng cộng: {calculateTotal()} ₫</h2>
              </div>
              <button type="submit" className="btn btn-primary btn-lg">
                Đặt hàng ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
