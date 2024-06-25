import React from "react";
import {
  FaBolt,
  FaCarSide,
  FaChartBar,
  FaChevronLeft,
  FaChevronRight,
  FaRegCalendarAlt,
  FaRegSun,
  FaStickyNote,
  FaTachometerAlt,
  FaWrench,
} from "react-icons/fa";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <div className="bg-[#4e73df] h-screen px-[25px]">
      <Link to={"/"}>
        <div className="px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]">
          <h1 className="text-white text-[20px] leading-[24px] font-extrabold cursor-pointer">
            Admin panel
          </h1>
        </div>
      </Link>

      <Link to={"/"}>
        <div className="flex items-center gap-[10px] py-[20px] border-b-[1px] border-[#EDEDED]/[0.3]">
          <FaTachometerAlt color="#fff" />
          <p className="text-[14px] leading-[20px] font-bold text-white">
            Dashboard
          </p>
        </div>
      </Link>
      <div className="pt-[15px] border-b-[1px] border-[#EDEDED]/[0.3]">
        <p className="text-[10px] font-extrabold leading-[16px] text-white/[0.4]">
          INTERFACE
        </p>
        <Link to={"statistics"}>
          <div className="flex items-center justify-between gap-[10px] py-[15px] cursor-pointer">
            <div className="flex items-center gap-[10px]">
              <FaCarSide color="#fff" />
              <p className="text-[14px] leading-[20px] font-normal text-white">
                Statistics
              </p>
            </div>
            <FaChevronRight color="#fff" />
          </div>
        </Link>
        <Link to={"students"}>
          <div className="flex items-center justify-between gap-[10px] py-[15px] cursor-pointer">
            <div className="flex items-center gap-[10px]">
              <FaChartBar color="#fff" />
              <p className="text-[14px] leading-[20px] font-normal text-white">
                Students
              </p>
            </div>
            <FaChevronRight color="#fff" />
          </div>
        </Link>
        <Link to={"team"}>
          <div className="flex items-center justify-between gap-[10px] py-[15px] cursor-pointer">
            <div className="flex items-center gap-[10px]">
              <FaChartBar color="#fff" />
              <p className="text-[14px] leading-[20px] font-normal text-white">
                Teams
              </p>
            </div>
            <FaChevronRight color="#fff" />
          </div>
        </Link>
        <Link to={"schools"}>
          <div className="flex items-center justify-between gap-[10px] py-[15px] cursor-pointer">
            <div className="flex items-center gap-[10px]">
              <FaChartBar color="#fff" />
              <p className="text-[14px] leading-[20px] font-normal text-white">
                Schools
              </p>
            </div>
            <FaChevronRight color="#fff" />
          </div>
        </Link>
        <Link to={"rounds"}>
          <div className="flex items-center justify-between gap-[10px] py-[15px] cursor-pointer">
            <div className="flex items-center gap-[10px]">
              <FaChartBar color="#fff" />
              <p className="text-[14px] leading-[20px] font-normal text-white">
                Rounds
              </p>
            </div>
            <FaChevronRight color="#fff" />
          </div>
        </Link>
        <Link to={"results"}>
          <div className="flex items-center justify-between gap-[10px] py-[15px] cursor-pointer">
            <div className="flex items-center gap-[10px]">
              <FaChartBar color="#fff" />
              <p className="text-[14px] leading-[20px] font-normal text-white">
                Results
              </p>
            </div>
            <FaChevronRight color="#fff" />
          </div>
        </Link>
        <Link to={"contestants"}>
          <div className="flex items-center justify-between gap-[10px] py-[15px] cursor-pointer">
            <div className="flex items-center gap-[10px]">
              <FaChartBar color="#fff" />
              <p className="text-[14px] leading-[20px] font-normal text-white">
                Contestants
              </p>
            </div>
            <FaChevronRight color="#fff" />
          </div>
        </Link>
        <Link to={"competitions"}>
          <div className="flex items-center justify-between gap-[10px] py-[15px] cursor-pointer">
            <div className="flex items-center gap-[10px]">
              <FaChartBar color="#fff" />
              <p className="text-[14px] leading-[20px] font-normal text-white">
                Competitions
              </p>
            </div>
            <FaChevronRight color="#fff" />
          </div>
        </Link>
        <Link to={"coachs"}>
          <div className="flex items-center justify-between gap-[10px] py-[15px] cursor-pointer">
            <div className="flex items-center gap-[10px]">
              <FaChartBar color="#fff" />
              <p className="text-[14px] leading-[20px] font-normal text-white">
                Coachs
              </p>
            </div>
            <FaChevronRight color="#fff" />
          </div>
        </Link>
        <Link to={"cars"}>
          <div className="flex items-center justify-between gap-[10px] py-[15px] cursor-pointer">
            <div className="flex items-center gap-[10px]">
              <FaChartBar color="#fff" />
              <p className="text-[14px] leading-[20px] font-normal text-white">
                Cars
              </p>
            </div>
            <FaChevronRight color="#fff" />
          </div>
        </Link>
        <Link to={"brackets"}>
          <div className="flex items-center justify-between gap-[10px] py-[15px] cursor-pointer">
            <div className="flex items-center gap-[10px]">
              <FaChartBar color="#fff" />
              <p className="text-[14px] leading-[20px] font-normal text-white">
                Brackets
              </p>
            </div>
            <FaChevronRight color="#fff" />
          </div>
        </Link>
      </div>

      <div className="pt-[15px] border-b-[1px] border-[#EDEDED]/[0.3] pb-[15px]">
        <p className="text-[10px] font-extrabold leading-[16px] text-white/[0.4]">
          ADDONS
        </p>
        <div className="flex items-center justify-between gap-[10px] py-[15px] cursor-pointer">
          <div className="flex items-center gap-[10px]">
            <FaRegSun color="#fff" />
            <p className="text-[14px] leading-[20px] font-normal text-white">
              Components
            </p>
          </div>
          <FaChevronRight color="#fff" />
        </div>
        <div className="flex items-center justify-between gap-[10px] py-[15px] cursor-pointer">
          <div className="flex items-center gap-[10px]">
            <FaWrench color="#fff" />
            <p className="text-[14px] leading-[20px] font-normal text-white">
              Ultilities
            </p>
          </div>
          <FaChevronRight color="#fff" />
        </div>
        <div className="flex items-center gap-[10px] py-[15px]">
          <FaRegCalendarAlt color="#fff" />
          <p className="text-[14px] leading-[20px] font-normal text-white">
            Tables
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
