import React from "react";
import { MdCancel } from "react-icons/md";
import { handleOtherData } from "./Store";

const CustomPopup = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(187, 187, 187, 0.3)",
        zIndex: 2,
      }}
    >
      <div
        style={{
          width: "300px",
          overflow: "hidden",
          display: "block",
          backgroundColor: "white",
          border: "1px solid #f7f7f7",
          borderRadius: "10px",
        }}
      >
        {/* popup header  */}
        <div
          style={{ display: "flex", width: "100%", padding: "6px 10px 2px" }}
        >
          {/* popup title */}
          <span style={{ width: "90%" }} className="text-start">
            <h6>Calculator</h6>
          </span>
          {/* cross btn */}
          <span
            style={{ width: "10%", color: "red", cursor: "pointer" }}
            className="text-end"
            onClick={() => handleOtherData("isCalculatorOn", false)}
          >
            <MdCancel />
          </span>
        </div>
        <hr style={{ margin: "0px" }} />
        <div
          style={{
            maxHeight: "460px",
            overflow: "hidden",
            padding: "0px 10px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomPopup;
