import React, { useEffect, useState, useRef } from "react";
import { read, utils } from "xlsx";
import { GiNotebook } from "react-icons/gi";
import {
  AiOutlineMinusCircle,
  AiOutlineClear,
  AiOutlineDownload,
} from "react-icons/ai";
import { FaCalculator } from "react-icons/fa";
import { HiOutlineViewList } from "react-icons/hi";
import { TbFileImport, TbReload } from "react-icons/tb";
import logo from "./images/logo.png";
import { handleOtherData, useOtherStore, useUserGuideDataStore } from "./Store";
import CustomPopup from "./CustomPopup";

const NavbarComponent = () => {
  const buttonRef = useRef(null);
  const hiddenFileInput = useRef(null);
  const otherStore = useOtherStore();

  const userGuideData = useUserGuideDataStore((store) => store);
  const chsFl = useOtherStore((store) => store.chsFl);
  const customers = useOtherStore((store) => store.customers);
  const customersData = useOtherStore((store) => store.customersData);
  const filterCustomersData = useOtherStore(
    (store) => store.filterCustomersData
  );
  const isCalculatorOn = useOtherStore((store) => store.isCalculatorOn);
  const typeChar = useOtherStore((store) => store.typeChar);
  const calcResult = useOtherStore((store) => store.calcResult);
  const dltItmId = useOtherStore((store) => store.dltItmId);
  const excelFile = useOtherStore((store) => store.excelFile);
  const newCustomerName = useOtherStore((store) => store.newCustomerName);
  const selectedCustomer = useOtherStore((store) => store.selectedCustomer);

  const getExcelFile = ($event) => {
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          if (Boolean(rows[0].CustomerName)) {
            handleOtherData("selectedCustomer", "");
            handleOtherData("customersData", []);
            rows.pop();
            handleOtherData("excelFile", rows);
            let newArr = rows.map((ele, i) => {
              const {
                Date,
                DebitAmount,
                CreditAmount,
                Description,
                id,
                ...rest
              } = ele;
              return rest;
            });
            let a = [...new Set(newArr.map((o) => JSON.stringify(o)))].map(
              (s) => JSON.parse(s)
            );
            a.map((itm, ind) => (itm.id = ind + 1));
            handleOtherData("customers", a);
          } else {
            handleOtherData("alertMsg", "Please choose correct file!");
            handleOtherData("alertActive", true);
            handleOtherData("chsFl", "");
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const createCustomerData = (e) => {
    handleOtherData("customersData", []);
    handleOtherData("selectedCustomer", "");
    handleOtherData("selectedCustomer", e);
    handleOtherData(
      "customersData",
      excelFile?.filter((itm) => itm.CustomerName === e)
    );
  };

  var today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const exportExcel = () => {
    const totalDebit = excelFile.reduce((accumulator, object) => {
      return accumulator + object.DebitAmount;
    }, 0);
    const totalCredit = excelFile.reduce((accumulator, object) => {
      return accumulator + object.CreditAmount;
    }, 0);
    const total = totalCredit - totalDebit;

    const XLSX = require("xlsx");
    let binaryWS = XLSX.utils.json_to_sheet([
      ...excelFile.map((itm, index) => ({
        ...itm,
        id: index + 1,
      })),
      {
        id: total > 0 ? "You have to pay" : "You will get",
        Date: "",
        CustomerName: "",
        DebitAmount: "",
        CreditAmount: "",
        Description: `${Math.abs(total)} /-`,
      },
    ]);
    // Create a new Workbook
    var wb = XLSX.utils.book_new();
    // Name your sheet
    XLSX.utils.book_append_sheet(wb, binaryWS, "Binary values");
    // export your excel
    XLSX.writeFile(wb, `${today}_transaction.xlsx`);
  };

  const getLocalStorageData = () => {
    const diginotebookData = JSON.parse(
      localStorage.getItem("diginotebookData")
    );
    if (diginotebookData !== null) {
      // console.log(diginotebookData)
      handleOtherData("chsFl", "");
      handleOtherData("selectedCustomer", "");
      handleOtherData("customersData", []);
      handleOtherData("excelFile", diginotebookData);
      let newArr = diginotebookData.map((ele, i) => {
        const { Date, DebitAmount, CreditAmount, Description, id, ...rest } =
          ele;
        return rest;
      });
      let a = [...new Set(newArr.map((o) => JSON.stringify(o)))].map((s) =>
        JSON.parse(s)
      );
      a.map((itm, ind) => (itm.id = ind + 1));
      handleOtherData("customers", a);
    }
  };

  const calc = (itm) => {
    if (itm === "AC") {
      handleOtherData("typeChar", "");
      handleOtherData("calcResult", "");
    } else if (itm === "C") {
      if (typeChar.length !== 0) {
        handleOtherData("typeChar", typeChar.substring(0, typeChar.length - 1));
        let char = typeChar.substring(0, typeChar.length - 1);
        if (
          char.charAt(char.length - 1) === "1" ||
          char.charAt(char.length - 1) === "2" ||
          char.charAt(char.length - 1) === "3" ||
          char.charAt(char.length - 1) === "4" ||
          char.charAt(char.length - 1) === "5" ||
          char.charAt(char.length - 1) === "6" ||
          char.charAt(char.length - 1) === "7" ||
          char.charAt(char.length - 1) === "8" ||
          char.charAt(char.length - 1) === "9" ||
          char.charAt(char.length - 1) === "0"
        ) {
          handleOtherData(
            "calcResult",
            eval(typeChar.substring(0, typeChar.length - 1))
          );
        } else {
          handleOtherData(
            "calcResult",
            eval(char.substring(0, char.length - 1))
          );
        }
      } else {
        handleOtherData("typeChar", "");
        handleOtherData("calcResult", "");
      }
    } else if (itm === "^") {
      let char = eval(typeChar) * eval(typeChar);
      handleOtherData("typeChar", `${char}`);
      handleOtherData("calcResult", char);
    } else if (itm === "%") {
      let char = eval(typeChar) / 100;
      handleOtherData("typeChar", `${char}`);
      handleOtherData("calcResult", char);
    } else {
      let char = typeChar.concat(itm);
      handleOtherData("typeChar", char);
      if (
        char.charAt(char.length - 1) === "1" ||
        char.charAt(char.length - 1) === "2" ||
        char.charAt(char.length - 1) === "3" ||
        char.charAt(char.length - 1) === "4" ||
        char.charAt(char.length - 1) === "5" ||
        char.charAt(char.length - 1) === "6" ||
        char.charAt(char.length - 1) === "7" ||
        char.charAt(char.length - 1) === "8" ||
        char.charAt(char.length - 1) === "9" ||
        char.charAt(char.length - 1) === "0"
      ) {
        handleOtherData("calcResult", eval(typeChar.concat(itm)));
      }
    }
  };

  useEffect(() => {
    getLocalStorageData();
  }, []);

  useEffect(() => {
    buttonRef.current.click();
  }, []);
  return (
    <div>
      {/* navbar */}
      <nav class="navbar bg-body-tertiary" style={{ padding: 0 }}>
        <div class="container-fluid" style={{ backgroundColor: "white" }}>
          {/* logo */}
          <div
            className="navbar-brand"
            href="#"
            style={{ display: "flex", cursor: "pointer" }}
          >
            <div
              ref={buttonRef}
              className="text-end p-0"
              data-bs-toggle="modal"
              data-bs-target="#userGuideModal"
              style={{ color: "#dc3545" }}
            >
              <GiNotebook
                size={35}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="User guide"
              />
            </div>
            <div className="text-start p-0">
              <img
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Back to home page"
                style={{ height: "40px" }}
                src={logo}
                alt="error!"
                onClick={() => {
                  handleOtherData("OpenTransactionsPage", false);
                  handleOtherData("OpenNotebookPage", false);
                }}
              />
            </div>
          </div>
          <form class="d-flex" role="search">
            {/* open calculator */}
            <FaCalculator
              className="pe-1"
              size={window.screen.width < 400 ? 20 : 30}
              onClick={() => handleOtherData("isCalculatorOn", true)}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Calculator"
            />
            {/* customer select */}
            {customers?.length !== 0 && (
              <div class="dropdown">
                <button
                  class="btn dropdown-toggle border"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedCustomer === ""
                    ? "-Select Customer-"
                    : selectedCustomer}
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  {customers?.map((itm, indx) => (
                    <li className="d-flex m-0">
                      <button
                        className="dropdown-item btn btn-sm m-0"
                        type="button"
                        onClick={() => createCustomerData(itm?.CustomerName)}
                      >
                        {itm?.CustomerName}
                      </button>
                      {/* customer delete btn */}
                      <button
                        className="dropdown-item btn btn-sm m-0 text-end"
                        type="button"
                        onClick={() => {
                          let dltNewArr = customers.filter(
                            (itm1) => itm.id !== itm1.id
                          );
                          handleOtherData("customers", dltNewArr);
                          handleOtherData("customersData", []);
                          handleOtherData("selectedCustomer", "");
                          handleOtherData("newCustomerName", "");
                        }}
                      >
                        |{" "}
                        <span className="text-danger">
                          <AiOutlineMinusCircle />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* add new customer */}
            <input
              type="text"
              placeholder="Add New Customer"
              className="form-control form-control-sm mx-2 w-55"
              value={newCustomerName}
              onBlur={() => {
                if (newCustomerName !== "") {
                  if (
                    customers.filter(
                      (e, i) => e.CustomerName === newCustomerName
                    ).length === 0
                  ) {
                    handleOtherData("customers", [
                      ...customers,
                      {
                        id: customers.length + 1,
                        CustomerName: newCustomerName,
                      },
                    ]);
                  } else {
                    handleOtherData(
                      "alertMsg",
                      `${newCustomerName} already exist!`
                    );
                    handleOtherData("alertActive", true);
                  }
                  handleOtherData("newCustomerName", "");
                }
                handleOtherData("addCustomer", false);
              }}
              onChange={(e) => {
                handleOtherData("newCustomerName", e.target.value);
              }}
            />
            {/* dropdown */}
            <div class="dropdown" style={{ cursor: "pointer" }}>
              <span
                className="dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <HiOutlineViewList size={window.screen.width < 400 ? 20 : 30} />
              </span>
              <ul class="dropdown-menu dropdown-menu-end">
                {/* choose excel file */}
                {chsFl === "" ? (
                  <li
                    className="text-start align-middle p-1"
                    style={{ cursor: "pointer" }}
                  >
                    <input
                      className="form-control form-control-sm"
                      type="file"
                      id="formFile"
                      value={chsFl}
                      ref={hiddenFileInput}
                      style={{ display: "none" }}
                      onChange={(event) => {
                        handleOtherData("chsFl", event.target.value);
                        getExcelFile(event);
                      }}
                    ></input>
                    <div
                      className="d-flex"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("formFile").click();
                      }}
                    >
                      <span className="text-success">
                        <TbFileImport
                          size={window.screen.width < 400 ? 20 : 25}
                        />
                      </span>
                      <span>Edit Excel Record</span>
                    </div>
                  </li>
                ) : (
                  <li
                    style={{ cursor: "pointer" }}
                    className="text-start align-middle p-1 d-flex"
                    onClick={() => getLocalStorageData()}
                  >
                    <span className="text-success">
                      <TbReload size={window.screen.width < 400 ? 20 : 25} />
                    </span>
                    <span>Current Record</span>
                  </li>
                )}

                {/* download */}
                {excelFile.length !== 0 && (
                  <li
                    style={{ cursor: "pointer" }}
                    className="text-start align-middle p-1 d-flex"
                    onClick={() => exportExcel()}
                  >
                    <span className="text-success">
                      <AiOutlineDownload
                        size={window.screen.width < 400 ? 20 : 25}
                      />
                    </span>
                    <span>Download</span>
                  </li>
                )}
                {/* Clear All Records */}
                {excelFile.length !== 0 && (
                  <li
                    style={{ cursor: "pointer" }}
                    className="text-start align-middle p-1 d-flex"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal3"
                    onClick={(e) =>
                      handleOtherData(
                        "dltBtnType",
                        "Clear All Customers Records"
                      )
                    }
                  >
                    <span className="text-danger">
                      <AiOutlineClear
                        size={window.screen.width < 400 ? 20 : 25}
                      />
                    </span>
                    <span>Clear All Records</span>
                  </li>
                )}
              </ul>
            </div>
          </form>
        </div>
      </nav>
      {/* User Guide Modal */}
      <div
        class="modal fade"
        id="userGuideModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div
              class="modal-header"
              style={{
                padding: "10px 15px",
              }}
            >
              <h5 class="modal-title">User Guide</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body text-start">
              {userGuideData.map((bodyItm, bodyIndex) => (
                <>
                  <strong>{bodyItm.id}. </strong>
                  {bodyItm.name} <br />
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* confirm modal */}
      <div
        class="modal fade"
        id="exampleModal3"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-md modal-dialog-centered">
          <div class="modal-content">
            <div
              class="modal-header"
              style={{
                padding: "5px 10px",
              }}
            >
              <p className="text-start modal-title">
                Do you want to {otherStore.dltBtnType} ?
              </p>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div
              class="modal-footer"
              style={{
                padding: "1px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                style={{
                  padding: "0px 10px",
                }}
                onClick={() => {
                  if (otherStore.dltBtnType === "Clear All Customers Records") {
                    handleOtherData("excelFile", []);
                    handleOtherData("chsFl", "");
                    handleOtherData("customersData", []);
                    handleOtherData("filterCustomersData", []);
                    handleOtherData("selectedCustomer", "");
                    handleOtherData("srchDate", "");
                  } else if (
                    otherStore.dltBtnType ===
                    `Clear ${selectedCustomer}'s Record`
                  ) {
                    handleOtherData("customersData", []);
                    handleOtherData("filterCustomersData", []);
                    handleOtherData("srchDate", "");
                  } else if (otherStore.dltBtnType === "Delete This Record") {
                    let dltNewArr = customersData.filter(
                      (itm1) => dltItmId !== itm1.id
                    );
                    handleOtherData("customersData", dltNewArr);
                    let dltNewArr1 = filterCustomersData.filter(
                      (itm1) => dltItmId !== itm1.id
                    );
                    handleOtherData("filterCustomersData", dltNewArr1);
                  }
                }}
              >
                Yes
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                style={{
                  padding: "0px 10px",
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* calculator */}
      {isCalculatorOn && (
        <CustomPopup>
          <div style={{ height: "100px", width: "100%", fontSize: "23px", textAlign: "right" }}>{typeChar}</div>
          <hr style={{ margin: "0px", padding: "0px" }} />
          <div style={{ height: "40px", width: "100%", fontSize: "25px", textAlign: "right" }}>{calcResult}</div>
          <hr style={{ margin: "0px", padding: "0px" }} />
          <div style={{ height: "200px", width: "100%", fontSize: "25px" }}>
            <div style={{ height: "20%", width: "100%", display: "flex" }}>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc("AC")}
              >
                AC
              </div>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc("C")}
              >
                C
              </div>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc("%")}
              >
                %
              </div>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc("/")}
              >
                /
              </div>
            </div>
            <div style={{ height: "20%", width: "100%", display: "flex" }}>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc("7")}
              >
                7
              </div>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc("8")}
              >
                8
              </div>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc("9")}
              >
                9
              </div>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc("*")}
              >
                *
              </div>
            </div>
            <div style={{ height: "20%", width: "100%", display: "flex" }}>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc("4")}
              >
                4
              </div>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc("5")}
              >
                5
              </div>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc("6")}
              >
                6
              </div>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc("-")}
              >
                -
              </div>
            </div>
            <div style={{ height: "20%", width: "100%", display: "flex" }}>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc("1")}
              >
                1
              </div>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc("2")}
              >
                2
              </div>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc("3")}
              >
                3
              </div>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc("+")}
              >
                +
              </div>
            </div>
            <div style={{ height: "20%", width: "100%", display: "flex" }}>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
              ></div>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc("0")}
              >
                0
              </div>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc(".")}
              >
                .
              </div>
              <div
                className="vhCenter"
                style={{ height: "100%", width: "25%" }}
                onClick={() => calc("^")}
              >
                ^
              </div>
            </div>
          </div>
        </CustomPopup>
      )}
    </div>
  );
};

export default NavbarComponent;
