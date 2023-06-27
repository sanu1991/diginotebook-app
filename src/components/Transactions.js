import React, { useState } from "react";
import { read, utils, writeFile } from "xlsx";
import { ImListNumbered } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import { MdAddCircle } from "react-icons/md";
import { FaEraser } from "react-icons/fa";
import { handleOtherData, useFieldDataStore, useOtherStore } from "./Store";
import { v4 as uuid } from "uuid";

const Transactions = () => {
  const fldDataStore = useFieldDataStore();
  const otherStore = useOtherStore();
  //   console.log(fldDataStore);
  console.log(otherStore);

  const selectedCustomer = useOtherStore((store) => store.selectedCustomer);
  const customersData = useOtherStore((store) => store.customersData);
  const excelFile = useOtherStore((store) => store.excelFile);

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

  return (
    <div>
      <div
        className="datatable"
        style={{
          height: "430px",
          overflowY: "scroll",
          border: "1px solid grey",
          borderRadius: "5px",
        }}
      >
        <table className="table table-dark table-striped table-hover">
          <thead aria-disabled="true">
            <tr style={{ width: "100%" }}>
              <th className="align-middle" style={{ width: "5%" }} scope="col">
                <ImListNumbered size={20} />
              </th>
              <th className="align-middle" style={{ width: "15%" }} scope="col">
                Date
              </th>
              <th className="align-middle" style={{ width: "15%" }} scope="col">
                Debit
              </th>
              <th className="align-middle" style={{ width: "15%" }} scope="col">
                Credit
              </th>
              <th className="align-middle" style={{ width: "40%" }} scope="col">
                Description
              </th>
              <th className="align-middle" style={{ width: "10%" }} scope="col">
                <div style={{ display: "flex" }}>
                  <div className="text-success">
                    <MdAddCircle
                      className="pe-1"
                      size={30}
                      onClick={() => addRow()}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Add Transactions"
                    />
                  </div>
                  <div style={{ color: "#dc3545" }}>
                    <FaEraser
                      className="ps-1"
                      size={25}
                      onClick={() => {
                        if (customersData.length === 0) {
                          handleOtherData(
                            "alertMsg",
                            "No Records Found To Clear!"
                          );
                          handleOtherData("alertActive", true);
                        } else {
                          handleOtherData("customersData", []);
                        }
                      }}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title={
                        customersData.length === 0
                          ? "Clear Record"
                          : `Clear ${selectedCustomer}'s Record`
                      }
                    />
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {customersData?.map((itm, indx) => (
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
                      //   setCustomersData(editedArr);
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
                          ? { ...ele, DebitAmount: Number(e.target.value) }
                          : ele
                      );
                      //   setCustomersData(editedArr);
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
                          ? { ...ele, CreditAmount: Number(e.target.value) }
                          : ele
                      );
                      //   setCustomersData(editedArr);
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
                      //   setCustomersData(editedArr);
                      handleOtherData("customersData", editedArr);
                    }}
                  />
                </td>
                <td className="table-light">
                  <button
                    className="btn btn-sm"
                    type="button"
                    onClick={(e) => {
                      console.log(customersData);
                      let dltNewArr = customersData.filter(
                        (itm1) => itm.id !== itm1.id
                      );
                      //   setCustomersData(dltNewArr);
                      handleOtherData("customersData", dltNewArr);
                    }}
                  >
                    <MdDelete size={20} style={{ color: "#dc3545" }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customersData.length === 0 && (
          <h2 style={{ color: "#eeeded" }}>No Records Found</h2>
        )}
      </div>
      <div style={{ width: "100%", display: "flex", padding: "10px 20px" }}>
        <div
          style={{ width: "20%" }}
          className={
            total() > 0
              ? "text-start fw-bold text-success"
              : "text-start fw-bold text-danger"
          }
        >
          {total() > 0 ? "You have to pay" : "You will get"}
        </div>
        <div
          style={{ width: "80%" }}
          className={
            total() > 0
              ? "text-end fw-bold text-success"
              : "text-end fw-bold text-danger"
          }
        >{`${Math.abs(total())} /-`}</div>
      </div>
      {/* save btns */}
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
      <div className="d-grid">
        <button
          disabled={excelFile.length === 0 ? true : false}
          className="btn btn-outline-success"
          type="button"
          onClick={() => exportExcel()}
        >
          <b>Save All Records</b>
        </button>
      </div>
    </div>
  );
};

export default Transactions;
