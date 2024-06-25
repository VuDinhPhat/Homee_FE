import React, { useEffect, useState } from "react";
import MatchInfo from "../../components/Match/MatchInfo";
import { useNavigate } from "react-router-dom";

//import Cookies from "js-cookie";

const Staticstis = () => {
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

  return (
    <>
      <MatchInfo />
    </>
  );
};

export default Staticstis;
