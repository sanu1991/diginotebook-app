import React from "react";
import NavbarComponent from "./NavbarComponent";
import { handleOtherData, useOtherStore } from "./Store";
import Transactions from "./Transactions";

const Container = () => {
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
              handleOtherData("alertActive", false);
            }}
          ></button>
        </div>
      )}
      <NavbarComponent />
      <div>
        <Transactions />
      </div>
    </div>
  );
};

export default Container;
