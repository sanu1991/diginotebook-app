import React from "react";

const NoteBook = () => {
  return (
    <div>
      <div
        style={{
          height: "500px",
          overflowY: "scroll",
          border: "1px solid grey",
        //   borderRadius: "5px",
        }}
      ></div>
      {/* save btns */}
      <div className="d-grid">
        <button
          //   disabled={selectedCustomer === "" ? true : false}
          className="btn btn-danger"
          type="button"
          onClick={() => {}}
        >
          <b>Save</b>
        </button>
      </div>
      <div className="d-grid">
        <button
          //   disabled={excelFile.length === 0 ? true : false}
          className="btn btn-outline-danger"
          type="button"
          onClick={() => {}}
        >
          <b>Save All Records</b>
        </button>
      </div>
    </div>
  );
};

export default NoteBook;
