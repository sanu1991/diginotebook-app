import { create } from "zustand";

const userGuideData = [
  {
    Transactions: [
      {
        Header: "New User",
        Body: [
          {
            id: 1,
            name: "Click on 'Add new customer' button and type your Customer Name.",
          },
          {
            id: 2,
            name: "Select Customer Name from dropdown box.",
          },
          { id: 3, name: "Click on Add Button to add records." },
          {
            id: 4,
            name: "Click on filter button beside Date column to date wise filter customer data.",
          },
          {
            id: 5,
            name: "Click on Clear Button (beside Add button) to clear selected customer's records.",
          },
          {
            id: 6,
            name: "Click on Delete Button (end of each record) to delete single record.",
          },
          {
            id: 7,
            name: "You can Click on Clear Button (end of the navbar) to clear all customers records.",
          },
          { id: 8, name: "After edit records don't forget to save record." },
          {
            id: 9,
            name: "Now you can Add customer by click on 'Add new customer' button and Select Customer Name.",
          },
          {
            id: 10,
            name: "After completing, it's important to click on download to save record locally.",
          },
        ],
      },
      {
        Header: "Active User",
        Body: [
          {
            id: 1,
            name: "Choose last downloaded Excel File (Exm : mm_dd_yyyy_transaction.xlsx) from your download file.",
          },
          {
            id: 2,
            name: "Select Customer Name to view slected customer's record in Data table.",
          },
          { id: 3, name: "Click on Add Button to add new records." },
          {
            id: 4,
            name: "Click on filter button beside Date column to date wise filter customer data.",
          },

          {
            id: 5,
            name: "Click on Clear Button (beside Add button) to clear selected customer's records.",
          },
          {
            id: 6,
            name: "Click on Delete Button (end of each record) to delete single record.",
          },
          {
            id: 7,
            name: "You can Click on Clear Button (end of the navbar) to clear all customers records.",
          },
          { id: 8, name: "After edit records don't forget to save record." },
          {
            id: 9,
            name: "Now you can Add customer by click on 'Add new customer' button and Select Customer Name.",
          },
          {
            id: 10,
            name: "After completing, it's important to click on download to save record locally.",
          },
        ],
      },
    ],
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
  OpenTransactionsPage: false,
  OpenNotebookPage: false,
  chsFl: "",
  excelFile: [],
  customers: [],
  selectedCustomer: "",
  newCustomerName: "",
  customersData: [],
  filterCustomersData: [], // n
  srchDate: "", // n
  addCustomer: false,
  chsExcl: false,
  slctCstmr: false,
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
