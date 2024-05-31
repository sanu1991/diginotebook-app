import { create } from "zustand";

const userGuideData = [
  {
    id: 1,
    name: "To Create New Transaction Records: Enter Your 'Customer Name'.",
  },
  {
    id: 2,
    name: "To Edit Existing Transaction Records: Choose Last Downloaded Excel File (Exm : mm_dd_yyyy_transaction.xlsx) From Your Download File.",
  },
  {
    id: 3,
    name: "Select Customer Name From Dropdown Box Beside 'Add New Customer'.",
  },
  { id: 4, name: "Click On Add(+) Button To Add Records." },
  { id: 5, name: "After Enter Records Don't Forget To Click Save." },
  {
    id: 6,
    name: "After Completing, It's Important To Click On Download To Save Record Locally.",
  },
  {
    id: 7,
    name: "Click On Filter Button Beside Date Column To Date Wise Filter Customer Data.",
  },
  {
    id: 8,
    name: "Click On Clear Button(beside Add button) to Clear Selected Customer's Records.",
  },
  {
    id: 9,
    name: "Click On Delete Button (end of each record) to Delete Single record.",
  },
  {
    id: 10,
    name: "You Can Click On Clear Button (end of the navbar) To Clear All Customers Records.",
  },
];

export const useUserGuideDataStore = create((set) => [...userGuideData]);

const fieldData = {
  id: 0,
  Date: "",
  CustomerName: "",
  DebitAmount: 0,
  CreditAmount: 0,
  Description: "",
};
export const useFieldDataStore = create((set) => ({
  ...fieldData,
}));
export const handleFieldData = (key, value) => {
  useFieldDataStore.setState((state) => ({ [key]: value }));
};

const otherData = {
  isCalculatorOn: false,
  typeChar: "",
  calcResult: "",
  OpenTransactionsPage: false,
  OpenNotebookPage: false,
  chsFl: "",
  excelFile: [],
  customers: [],
  selectedCustomer: "",
  newCustomerName: "",
  customersData: [],
  filterCustomersData: [],
  srchDate: "",
  addCustomer: false,
  alertActive: false,
  dateSrchActive: false,
  alertMsg: "",
  userGuideShow: false,
  dltBtnType: "",
  dltItmId: {},
};
export const useOtherStore = create((set) => ({
  ...otherData,
}));
export const handleOtherData = (key, value) => {
  useOtherStore.setState((state) => ({ [key]: value }));
};
