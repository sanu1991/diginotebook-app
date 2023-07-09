import React, { useState } from "react";
import { ImListNumbered } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import { MdAddCircle, MdFilterListOff, MdFilterList } from "react-icons/md";
import { FaEraser } from "react-icons/fa";
import { AiOutlineCaretRight, AiOutlineCaretLeft } from "react-icons/ai";
import { handleOtherData, useFieldDataStore, useOtherStore } from "./Store";
import ReactPaginate from "react-paginate";

const Transactions = () => {
  const fldDataStore = useFieldDataStore();
  const otherStore = useOtherStore();
  //   console.log(fldDataStore);

  // console.log(window.screen.width)

  const selectedCustomer = useOtherStore((store) => store.selectedCustomer);
  const filterCustomersData = useOtherStore(
    (store) => store.filterCustomersData
  );
  const srchDate = useOtherStore((store) => store.srchDate);
  const customersData = useOtherStore((store) => store.customersData);
  const dateSrchActive = useOtherStore((store) => store.dateSrchActive);
  const excelFile = useOtherStore((store) => store.excelFile);
  // console.log(customersData);
  // console.log(excelFile);

  const customersDataRender =
    srchDate === "" ? customersData : filterCustomersData;

  var today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const addRow = () => {
    if (selectedCustomer !== "") {
      handleOtherData(
        "customersData",
        [...customersData, fldDataStore].map((itm, index) => ({
          ...itm,
          id: index + 1,
          CustomerName: selectedCustomer,
        }))
      );
    } else {
      handleOtherData("alertMsg", "Please choose or Add customer !");
      handleOtherData("alertActive", true);
    }
  };

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

  const total = () => {
    const totalDebit = customersData.reduce((accumulator, object) => {
      return accumulator + object.DebitAmount;
    }, 0);
    const totalCredit = customersData.reduce((accumulator, object) => {
      return accumulator + object.CreditAmount;
    }, 0);
    const total = totalCredit - totalDebit;
    return total;
  };

  // ================= for pagination ================ //
  const PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };
  const offset = currentPage * PER_PAGE;
  let pageCount = Math.ceil(customersData.length / PER_PAGE);

  return (
    <div>
      {/* table */}
      <div
        className="datatable"
        style={{
          height: "calc(100vh - 198.14px)",
          overflowY: "scroll",
          border: "1px solid grey",
          borderRadius: "5px",
        }}
      >
        <table className="table table-dark table-striped table-hover">
          <thead aria-disabled="true">
            <tr style={{ width: "100%" }}>
              <th className="align-middle" style={{ width: "5%" }} scope="col">
                <ImListNumbered size={15} />
              </th>
              {dateSrchActive === false ? (
                <th
                  className="align-middle"
                  style={{ width: "20%" }}
                  scope="col"
                >
                  Date
                  {customersData.length !== 0 && (
                    <MdFilterList
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Date wise filter"
                      style={{ marginLeft: "5px", cursor: "pointer" }}
                      onClick={(e) => handleOtherData("dateSrchActive", true)}
                    />
                  )}
                </th>
              ) : (
                <th
                  className="align-middle"
                  style={{ width: "20%" }}
                  scope="col"
                >
                  <div class="input-group">
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={srchDate}
                      onChange={(e) => {
                        handleOtherData("srchDate", e.target.value);
                        handleOtherData(
                          "filterCustomersData",
                          excelFile
                            ?.filter(
                              (itm, indx) =>
                                itm.CustomerName === selectedCustomer
                            )
                            .filter((itm, ind) => itm.Date === e.target.value)
                        );
                      }}
                    />
                    <span class="input-group-text">
                      <MdFilterListOff
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Clear filter"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          handleOtherData("dateSrchActive", false);
                          handleOtherData("filterCustomersData", []);
                          handleOtherData("srchDate", "");
                        }}
                      />
                    </span>
                  </div>
                </th>
              )}
              <th className="align-middle" style={{ width: "10%" }} scope="col">
                Debit
              </th>
              <th className="align-middle" style={{ width: "10%" }} scope="col">
                Credit
              </th>
              <th className="align-middle" style={{ width: "45%" }} scope="col">
                Description
              </th>
              <th className="align-middle" style={{ width: "10%" }} scope="col">
                <div style={{ display: "flex" }}>
                  <div className="text-success">
                    <MdAddCircle
                      className="pe-1"
                      size={window.screen.width < 400 ? 20 : 30}
                      onClick={() => addRow()}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Add Transactions"
                    />
                  </div>
                  {customersData.length !== 0 && (
                    <div
                      style={{ color: "#dc3545" }}
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal3"
                      onClick={() =>
                        handleOtherData(
                          "dltBtnType",
                          `Clear ${selectedCustomer}'s Record`
                        )
                      }
                    >
                      <FaEraser
                        className="ps-1"
                        size={window.screen.width < 400 ? 15 : 25}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={`Clear ${selectedCustomer}'s Record`}
                      />
                    </div>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* {customersData?.map((itm, indx) => ( */}
            {customersDataRender
              ?.slice(offset, offset + PER_PAGE)
              .map((itm, indx) => (
                <tr key={indx}>
                  <th scope="row" className="table-light">
                    {indx + 1}
                  </th>
                  <td className="table-light">
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={itm.Date || ""}
                      onChange={(e) => {
                        let editedArr = customersData.map((ele) =>
                          ele.id === itm.id
                            ? { ...ele, Date: e.target.value }
                            : ele
                        );
                        handleOtherData("customersData", editedArr);
                      }}
                    />
                  </td>
                  <td className="table-light">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={itm.DebitAmount || ""}
                      onChange={(e) => {
                        let editedArr = customersData.map((ele) =>
                          ele.id === itm.id
                            ? {
                                ...ele,
                                CreditAmount: 0,
                                DebitAmount: Number(e.target.value),
                              }
                            : ele
                        );
                        handleOtherData("customersData", editedArr);
                      }}
                    />
                  </td>
                  <td className="table-light">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={itm.CreditAmount || ""}
                      onChange={(e) => {
                        let editedArr = customersData.map((ele) =>
                          ele.id === itm.id
                            ? {
                                ...ele,
                                DebitAmount: 0,
                                CreditAmount: Number(e.target.value),
                              }
                            : ele
                        );
                        handleOtherData("customersData", editedArr);
                      }}
                    />
                  </td>
                  <td className="table-light">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={itm.Description || ""}
                      onChange={(e) => {
                        let editedArr = customersData.map((ele) =>
                          ele.id === itm.id
                            ? { ...ele, Description: e.target.value }
                            : ele
                        );
                        handleOtherData("customersData", editedArr);
                      }}
                    />
                  </td>
                  <td className="table-light">
                    <button
                      className="btn btn-sm"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal3"
                      onClick={(e) => {
                        handleOtherData("dltBtnType", "Delete This Record");
                        handleOtherData("dltItmId", itm.id);
                      }}
                    >
                      <MdDelete size={window.screen.width < 400 ? 15 : 20} style={{ color: "#dc3545" }} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {/* No Records Found */}
        {customersData.length === 0 && (
          <h2
            style={{
              height: "calc(100vh - 280px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#eeeded",
            }}
          >
            No Records Found
          </h2>
        )}
      </div>
      {/* total count */}
      {customersData.length !== 0 && (
        <div style={{ width: "100%", display: "flex", padding: "5px 20px" }}>
          <div style={{ width: "25%" }}></div>
          {/* paginate */}
          <div
            className="text-center"
            style={{
              width: "50%",
              padding: "0px",
              margin: "0px 0px -16px 0px",
            }}
          >
            <ReactPaginate
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={"pagination justify-content-center"}
              previousLabel={<AiOutlineCaretLeft />}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link text-success"}
              nextLabel={<AiOutlineCaretRight />}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link text-success"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              activeClassName={"page-item active"}
              disabledClassName={"page-item disabled"}
            />
          </div>
          {/* total */}
          <div
            style={{ width: "25%", paddingTop: "5px" }}
            className={
              total() > 0
                ? "text-end fw-bold text-success"
                : "text-end fw-bold text-danger"
            }
          >
            {total() > 0 ? "You have to pay : " : "You will get : "}{" "}
            {`${Math.abs(total())} /-`}
          </div>
        </div>
      )}
      {/* save btn */}
      <div className="d-grid">
        <button
          disabled={selectedCustomer === "" ? true : false}
          className="btn btn-success"
          type="button"
          onClick={() => {
            let arrAfterDlt = excelFile.filter(
              (e, i) => e.CustomerName !== selectedCustomer
            );
            handleOtherData("excelFile", [...arrAfterDlt, ...customersData]);
          }}
        >
          <b>
            Save {selectedCustomer === "" ? "" : `${selectedCustomer}'s Record`}{" "}
          </b>
        </button>
      </div>
      {/* Download btn */}
      <div className="d-grid">
        <button
          disabled={excelFile.length === 0 ? true : false}
          className="btn btn-outline-success"
          type="button"
          onClick={() => exportExcel()}
        >
          <b>Download</b>
        </button>
      </div>
    </div>
  );
};

export default Transactions;
