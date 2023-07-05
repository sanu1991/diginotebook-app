import React, { useState } from "react";
import { read, utils } from "xlsx";
import { GiNotebook } from "react-icons/gi";
import { AiOutlineMinusCircle, AiOutlineClear } from "react-icons/ai";
import { RiPlayListAddFill } from "react-icons/ri";
import { TbFileImport } from "react-icons/tb";
import { RxDropdownMenu } from "react-icons/rx";
import logo from "./images/logo.png";
import { handleOtherData, useOtherStore, useUserGuideDataStore } from "./Store";

const NavbarComponent = () => {
  const [ugClickedData, setUgClickedData] = useState("");

  const otherStore = useOtherStore();
  const OpenTransactionsPage = useOtherStore(
    (store) => store.OpenTransactionsPage
  );
  const userGuideData = useUserGuideDataStore((store) => store);
  // console.log(userGuideData);

  const OpenNotebookPage = useOtherStore((store) => store.OpenNotebookPage);
  const chsFl = useOtherStore((store) => store.chsFl);
  const customers = useOtherStore((store) => store.customers);
  const addCustomer = useOtherStore((store) => store.addCustomer);
  const chsExcl = useOtherStore((store) => store.chsExcl);
  const customersData = useOtherStore((store) => store.customersData);
  const dltItmId = useOtherStore((store) => store.dltItmId);
  // const slctCstmr = useOtherStore((store) => store.slctCstmr);
  const excelFile = useOtherStore((store) => store.excelFile);
  const newCustomerName = useOtherStore((store) => store.newCustomerName);
  const selectedCustomer = useOtherStore((store) => store.selectedCustomer);
  const userGuideShow = useOtherStore((store) => store.userGuideShow);

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
            // console.log(
            let a = [...new Set(newArr.map((o) => JSON.stringify(o)))].map(
              (s) => JSON.parse(s)
            );
            a.map((itm, ind) => (itm.id = ind + 1));
            // );
            handleOtherData(
              "customers",a
              // [...new Set(newArr.map((o) => JSON.stringify(o)))].map((s) =>
              //   JSON.parse(s)
              // )
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
      <nav class="navbar navbar-expand-lg" style={{padding: "0px"}}>
        <div class="container-fluid" style={{backgroundColor: "white"}}>
          {/* logo */}
          <div
            className="navbar-brand"
            href="#"
            style={{ display: "flex", cursor: "pointer" }}
          >
            <div
              className="text-end p-0"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              style={{ color: "#dc3545" }}
            >
              <GiNotebook size={35} />
            </div>
            <div className="text-start p-0">
              <img
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
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal3"
                    onClick={(e) =>
                      handleOtherData(
                        "dltBtnType",
                        "Clear All Customers Records"
                      )
                    }
                  >
                    <AiOutlineClear
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Clear All Customers Records"
                      size={25}
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
                    disabled="true"
                    className="btn btn-sm btn-outline-danger"
                    type="button"
                    onClick={() => {
                      handleOtherData("OpenNotebookPage", true);
                    }}
                  >
                    FD Calculator
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
      {/* User Guide Modal */}
      <div
        class="modal fade"
        id="exampleModal"
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
            <div class="modal-body">
              <p className="text-start">
                <strong>#</strong> Click on{" "}
                <img
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ height: "30px", cursor: "pointer" }}
                  src={logo}
                  alt="error!"
                  onClick={() => {
                    handleOtherData("OpenTransactionsPage", false);
                    handleOtherData("OpenNotebookPage", false);
                  }}
                />{" "}
                logo to retrun on Home page
              </p>
              {/* accordion */}
              {userGuideData.map((itm, indx) => (
                <div class="accordion" id="accordionExample1" key={indx}>
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne1">
                      <button
                        style={{ padding: "10px 15px", cursor: "pointer" }}
                        class="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne1"
                        aria-expanded="true"
                        aria-controls="collapseOne1"
                      >
                        {Object.keys(itm)}
                      </button>
                    </h2>
                    <div
                      id="collapseOne1"
                      class="accordion-collapse collapse show"
                      aria-labelledby="headingOne1"
                      data-bs-parent="#accordionExample1"
                    >
                      <div
                        class="accordion-body"
                        style={{
                          padding: "10px 15px 0px 15px",
                        }}
                      >
                        {itm[Object.keys(itm)].map((subItm) => (
                          <p className="text-start">
                            <b
                              style={{
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                setUgClickedData(e.target.innerText);
                                e.target.innerText === subItm.Header &&
                                  handleOtherData(
                                    "userGuideShow",
                                    !userGuideShow
                                  );
                              }}
                            >
                              {subItm.Header}
                            </b>
                            <br />
                            {ugClickedData === subItm.Header &&
                              userGuideShow &&
                              subItm.Body.map(
                                (bodyItm, bodyIndex) =>
                                  userGuideShow && (
                                    <>
                                      <strong>{bodyItm.id}.</strong>
                                      {bodyItm.name} <br />
                                    </>
                                  )
                              )}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
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
                    handleOtherData("selectedCustomer", "");
                  } else if (
                    otherStore.dltBtnType ===
                    `Clear ${selectedCustomer}'s Record`
                  ) {
                    handleOtherData("customersData", []);
                  } else if (otherStore.dltBtnType === "Delete This Record") {
                    let dltNewArr = customersData.filter(
                      (itm1) => dltItmId !== itm1.id
                    );
                    handleOtherData("customersData", dltNewArr);
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
    </div>
  );
};

export default NavbarComponent;
