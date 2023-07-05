import React from "react";
import NavbarComponent from "./NavbarComponent";
import { handleOtherData, useOtherStore } from "./Store";
import Transactions from "./Transactions";
import NoteBook from "./NoteBook";
import bckgrnd from "./images/bckgrnd.jpg";

const Container = () => {
  const OpenTransactionsPage = useOtherStore(
    (store) => store.OpenTransactionsPage
  );
  const OpenNotebookPage = useOtherStore((store) => store.OpenNotebookPage);
  const alertActive = useOtherStore((store) => store.alertActive);
  const alertMsg = useOtherStore((store) => store.alertMsg);

  return (
    <div className=".container">
      {/* Alerts */}
      {alertActive && (
        <div
          className="alert alert-danger alert-dismissible fade show text-center"
          role="alert"
          style={{
            position: "fixed",
            top: "0px",
            left: "0px",
            width: "100%",
            zIndex: "20",
          }}
        >
          <div>
            <strong>Hello user!</strong> {alertMsg}
          </div>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => {
              //   setAlertActive(false);
              handleOtherData("alertActive", false);
            }}
          ></button>
        </div>
      )}
      <NavbarComponent />
      {OpenTransactionsPage === false && (
        // <div
        //   className="homepagemainpic"
        //   style={{ height: "calc(100vh - 68.59px)", width: "100vw" }}
        // ></div>
        <div>
          <div
            style={{
              height: "calc(100vh - 51px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // color: "white",
              // fontFamily: 'Lobster'
            }}
          >
            <p className="label" style={{color: "white", fontFamily: 'Lobster', textShadow: "0 0 5px brown"}}>Ease Your Business With Digi-notebook</p>
          </div>
          <img
            style={{
              height: "100vh",
              width: "100vw",
              left: "0px",
              top: "0px",
              position: "absolute",
              zIndex: -1,
            }}
            src={bckgrnd}
            class="img-fluid"
            alt="error!"
          />
        </div>
      )}
      <div>
        {OpenTransactionsPage && <Transactions />}
        {OpenNotebookPage && <NoteBook />}
      </div>
    </div>
  );
};

export default Container;
