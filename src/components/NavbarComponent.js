import React from "react";
import { read, utils } from "xlsx";
import { GiNotebook } from "react-icons/gi";
import { AiOutlineMinusCircle, AiOutlineClear } from "react-icons/ai";
import { RiPlayListAddFill } from "react-icons/ri";
import { TbFileImport } from "react-icons/tb";
import { RxDropdownMenu } from "react-icons/rx";
import logo from "./images/logo.png";
import { handleOtherData, useOtherStore } from "./Store";

const NavbarComponent = () => {
  const otherStore = useOtherStore();
  const OpenTransactionsPage = useOtherStore(
    (store) => store.OpenTransactionsPage
  );
  const OpenNotebookPage = useOtherStore((store) => store.OpenNotebookPage);
  const chsFl = useOtherStore((store) => store.chsFl);
  const customers = useOtherStore((store) => store.customers);
  const addCustomer = useOtherStore((store) => store.addCustomer);
  const chsExcl = useOtherStore((store) => store.chsExcl);
  const slctCstmr = useOtherStore((store) => store.slctCstmr);
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
            handleOtherData(
              "customers",
              [...new Set(newArr.map((o) => JSON.stringify(o)))].map((s) =>
                JSON.parse(s)
              )
            );
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
    // setCustomersData([]);
    // setSelectedCustomers("");
    handleOtherData("customersData", []);
    handleOtherData("selectedCustomer", "");
    // setTimeout(() => {
    // setSelectedCustomers(e.target.value);
    //   setCustomersData(
    //     excelFile?.filter((itm, indx) => itm.CustomerName === e.target.value)
    //   );
    handleOtherData("selectedCustomer", e);
    handleOtherData(
      "customersData",
      excelFile?.filter((itm, indx) => itm.CustomerName === e)
    );
    // }, 20);
  };

  return (
    <div>
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          {/* logo */}
          <div
            className="navbar-brand"
            href="#"
            style={{ display: "flex", cursor: "pointer" }}
            onClick={() => {
              handleOtherData("OpenTransactionsPage", false);
              handleOtherData("OpenNotebookPage", false);
            }}
          >
            <div className="text-end p-0" style={{ color: "#dc3545" }}>
              <GiNotebook size={35} />
            </div>
            <div className="text-start p-0">
              <img style={{ height: "40px" }} src={logo} alt="error!" />
            </div>
          </div>
          {/* toggler btn */}
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo02"
            aria-controls="navbarTogglerDemo02"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          {/* collapsable navbar items */}
          {OpenTransactionsPage ? (
            <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
              {/* ms-auto for gape in left side/start */}
              {chsExcl && (
                <form class="d-flex ms-auto">
                  <div className="ps-1">
                    <input
                      className="form-control form-control-sm customFileInput"
                      autoFocus={chsExcl ? true : false}
                      type="file"
                      id="formFile"
                      value={chsFl}
                      onChange={(event) => {
                        handleOtherData("chsFl", event.target.value);
                        handleOtherData("selectedCustomer", "");
                        handleOtherData("customersData", []);
                        getExcelFile(event);
                      }}
                      //   onBlur={() => {
                      //     chsFl === "" && handleOtherData("chsExcl", false);
                      //   }}
                    ></input>
                  </div>
                </form>
              )}
              <ul class={chsExcl ? "navbar-nav" : "navbar-nav ms-auto"}>
                {chsExcl === false && (
                  <li class="nav-item dropdown text-start p-1">
                    <div className="text-success">
                      <TbFileImport
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Choose Excel file"
                        size={25}
                        onClick={() => {
                          handleOtherData("chsExcl", true);
                          handleOtherData("addCustomer", false);
                        }}
                      />
                    </div>
                  </li>
                )}
                {customers?.length !== 0 && (
                  <li class="nav-item dropdown text-start p-1">
                    <button
                      className="dropdown-toggle py-1 btn btn-sm border"
                      href="#"
                      id="navbarDropdownMenuLink"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {selectedCustomer === ""
                        ? "---Select Customer---"
                        : selectedCustomer}
                    </button>
                    <ul
                      class="dropdown-menu p-0"
                      aria-labelledby="navbarDropdownMenuLink"
                    >
                      {customers?.map((itm, indx) => (
                        <li className="d-flex m-0">
                          <button
                            className="dropdown-item btn btn-sm m-0"
                            type="button"
                            onClick={() =>
                              createCustomerData(itm?.CustomerName)
                            }
                          >
                            {itm?.CustomerName}
                          </button>
                          <button
                            className="dropdown-item btn btn-sm m-0 text-end"
                            type="button"
                            //   onClick={() => createCustomerData(itm?.CustomerName)}
                          >
                            | <AiOutlineMinusCircle />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
                <li class="nav-item text-start align-middle p-1">
                  {addCustomer ? (
                    <input
                      type="text"
                      autoFocus={addCustomer ? true : false}
                      placeholder="Add New Customer"
                      className="form-control form-control-sm"
                      onBlur={() => {
                        if (newCustomerName !== "") {
                          if (
                            customers.filter(
                              (e, i) => e.CustomerName === newCustomerName
                            ).length === 0
                          ) {
                            handleOtherData("customers", [
                              ...customers,
                              { CustomerName: newCustomerName },
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
                      }}
                      onChange={(e) => {
                        handleOtherData("newCustomerName", e.target.value);
                      }}
                    />
                  ) : (
                    <div className="text-success">
                      <RiPlayListAddFill
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Add New Customer"
                        size={25}
                        onClick={() => {
                          handleOtherData("addCustomer", true);
                          chsFl === "" && handleOtherData("chsExcl", false);
                        }}
                      />
                    </div>
                  )}
                </li>
                {/* Clear All Records */}
                {excelFile.length !== 0 && (
                  <li
                    class="nav-item text-start align-middle p-1"
                    style={{ color: "#dc3545" }}
                  >
                    <AiOutlineClear
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Clear All Records"
                      size={25}
                      onClick={() => {
                        if (excelFile.length === 0) {
                          handleOtherData(
                            "alertMsg",
                            "No Records Found To Clear!"
                          );
                          handleOtherData("alertActive", true);
                        } else {
                          handleOtherData("excelFile", []);
                        }
                      }}
                    />
                  </li>
                )}
              </ul>
            </div>
          ) : OpenNotebookPage ? (
            <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
              {/* ms-auto for gape in left side/start */}
              <form class="d-flex ms-auto">
                <div className="pe-1">
                  <h1 className="col-form-label-sm">Choose .txt file</h1>
                </div>
                <div className="ps-1">
                  <input
                    className="form-control form-control-sm customFileInput"
                    type="file"
                    id="formFile"
                    // value={chsFl}
                    // onChange={(event) => {
                    //   handleOtherData("chsFl", event.target.value);
                    //   handleOtherData("selectedCustomer", "");
                    //   handleOtherData("customersData", []);
                    //   getExcelFile(event);
                    // }}
                  ></input>
                </div>
              </form>
            </div>
          ) : (
            <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
              {/* ms-auto for gape in left side/start */}
              <ul class="navbar-nav ms-auto">
                <li className="nav-item text-start align-middle p-1">
                  <button
                    className="btn btn-sm btn-outline-danger"
                    type="button"
                    onClick={() => {
                      handleOtherData("OpenNotebookPage", true);
                    }}
                  >
                    Notepad
                  </button>
                </li>
                <li className="nav-item text-start align-middle p-1">
                  <button
                    className="btn btn-sm btn-outline-danger"
                    type="button"
                    onClick={() => {
                      handleOtherData("OpenTransactionsPage", true);
                    }}
                  >
                    Transactions
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavbarComponent;
