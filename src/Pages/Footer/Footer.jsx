import React from "react";
import Logo from "../../assets/logo.png";
import Logo2 from "../../assets/logo2.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer bg-customColor">
      <h1>Homee</h1>
      <div className="footer-bottom"></div>

      <div className="footer-content">
        <div className=""></div>
        <div className="footer-left">
          <div className="footer-links">
            <ul>
              <li>Về Homee</li>
            </ul>
            <ul>
              <li>Mở quán trên Homee</li>
            </ul>
            <ul>
              <li>Trung tâm hỗ trợ</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Homee | Câu hỏi thường gặp | Chính sách bảo mật</p>
      </div>
    </footer>
  );
};

export default Footer;
