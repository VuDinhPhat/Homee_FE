import React, { useEffect, useState } from "react";
import { FaEllipsisV, FaRegCalendarMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import PieComponent from "./Pie/PieComponent";
import { Progress } from "antd";
import { Box, CircularProgress } from "@mui/material";

const Main = () => {
  const navigate = useNavigate();

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

  // useEffect(() => {
  //   var username = getCookie("username");
  //   if (username !== "") {
  //   } else {
  //     navigate("/login");
  //   }
  // }, []);

  // const data = [
  //   {
  //     year: "2020",
  //     Member: 500,
  //     Mentor: 150,
  //     Team: 100,
  //   },
  //   {
  //     year: "2021",
  //     Member: 300,
  //     Mentor: 60,
  //     Team: 43,
  //   },
  //   {
  //     year: "2022",
  //     Member: 860,
  //     Mentor: 172,
  //     Team: 148,
  //   },
  //   {
  //     year: "2023",
  //     Member: 798,
  //     Mentor: 160,
  //     Team: 159,
  //   },
  //   {
  //     year: "2024",
  //     Member: 1235,
  //     Mentor: 247,
  //     Team: 240,
  //   },
  // ];
  return (
    <div></div>
    //   <div className="pt-[25px] px-[25px] bg-[#F9F8FC]">
    //     <div className="flex items-center justify-between">
    //       <h1 className="text-[#5a5c69] text-[28px] leading-[34px] font-normal cursor-pointer">
    //         Dashboard
    //       </h1>
    //       <button className="bg-[#2e59d9] h-[32px] text-white px-[30px] rounded-[3px] flex items-center justify-center">
    //         Generate Report
    //       </button>
    //     </div>
    //     <div className="grid grid-cols-4 gap-[30px] mt-[25px] pb-[15px]">
    //       <div className="h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#4e73df] px-[30px] flex items-center justify-between cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out">
    //         <div>
    //           <h2 className="text-[#B589DF] text-[11px] leading-[17px] font-bold">
    //             TEAM (2023-2024)
    //           </h2>
    //           <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">
    //             399
    //           </h1>
    //         </div>
    //         <FaRegCalendarMinus fontSize={28} color="" />
    //       </div>
    //       <div className="h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#1cc88a] px-[30px] flex items-center justify-between cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out">
    //         <div>
    //           <h2 className="text-[#1cc88a] text-[11px] leading-[17px] font-bold">
    //             MEMBER (2023-2024)
    //           </h2>
    //           <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">
    //             2,033
    //           </h1>
    //         </div>
    //         <FaRegCalendarMinus fontSize={28} color="" />
    //       </div>
    //       <div className="h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#1373b3] px-[30px] flex items-center justify-between cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out">
    //         <div>
    //           <h2 className="text-[#1cc88a] text-[11px] leading-[17px] font-bold">
    //             TASK
    //           </h2>
    //           <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">
    //             $240,000
    //           </h1>
    //         </div>
    //         <FaRegCalendarMinus fontSize={28} color="" />
    //       </div>
    //       <div className="h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#e0cb11] px-[30px] flex items-center justify-between cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out">
    //         <div>
    //           <h2 className="text-[#1cc88a] text-[11px] leading-[17px] font-bold">
    //             PENDING REQUESTS
    //           </h2>
    //           <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">
    //             $240,000
    //           </h1>
    //         </div>
    //         <FaRegCalendarMinus fontSize={28} color="" />
    //       </div>
    //     </div>

    //     <div className="flex mt-[22px] w-full gap-[30px]">
    //       <div className="basis-[70%] border bg-white shadow-md cursor-pointer rounded-[4px]">
    //         <div className="bg-[#F8F9FC] flex items-center justify-between px-[20px] py-[15px] border-b-[1px] border-[#EDEDED] mb-[20px]">
    //           <h2>Earning Overview</h2>
    //           <FaEllipsisV color="gray" className="cursor-pointer" />
    //         </div>
    //         <div style={{ height: "85%", width: "100%" }}>
    //           <ResponsiveContainer width="100%" height="100%">
    //             <BarChart
    //               width={500}
    //               height={300}
    //               data={data}
    //               margin={{
    //                 top: 5,
    //                 right: 30,
    //                 left: 20,
    //                 bottom: 5,
    //               }}
    //             >
    //               <CartesianGrid strokeDasharray="3 3" />
    //               <XAxis dataKey="year" />
    //               <YAxis />
    //               <Tooltip />
    //               <Legend />
    //               <Bar
    //                 dataKey="Member"
    //                 fill="#8884d8"
    //                 activeBar={<Rectangle fill="pink" stroke="blue" />}
    //               />
    //               <Bar
    //                 dataKey="Mentor"
    //                 fill="#82ca9d"
    //                 activeBar={<Rectangle fill="gold" stroke="purple" />}
    //               />
    //               <Bar
    //                 dataKey="Team"
    //                 fill="yellow"
    //                 activeBar={<Rectangle fill="gold" stroke="purple" />}
    //               />
    //             </BarChart>
    //           </ResponsiveContainer>
    //         </div>
    //       </div>
    //       <div className="basis-[30%] border bg-white shadow-md cursor-pointer rounded-[4px]">
    //         <div className="bg-[#F8F9FC] flex items-center justify-between px-[20px] py-[15px] border-b-[1px] border-[#EDEDED]">
    //           <h2>Revenue Resources</h2>
    //           <FaEllipsisV color="gray" className="cursor-pointer" />
    //         </div>
    //         <div className="pl-[35px]">
    //           <PieComponent />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
  );
};

export default Main;
