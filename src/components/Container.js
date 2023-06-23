import React from "react";
import NavbarComponent from "./NavbarComponent";
import { handleOtherData, useOtherStore } from "./Store";
import Transactions from "./Transactions";
import NoteBook from "./NoteBook";

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
      <div
        // onClick={() => {
        //   handleOtherData("chsExcl", false);
        // }}
      >
        {OpenTransactionsPage && <Transactions />}
        {OpenNotebookPage && <NoteBook />}
      </div>
    </div>
  );
};

export default Container;
