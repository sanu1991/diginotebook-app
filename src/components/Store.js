import { create } from "zustand";

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
  addCustomer: false,
  chsExcl: false,
  slctCstmr: false,
  alertActive: false,
  alertMsg: "",
};
export const useOtherStore = create((set) => ({
  ...otherData,
}));
export const handleOtherData = (key, value) => {
  useOtherStore.setState((state) => ({ [key]: value }));
};
