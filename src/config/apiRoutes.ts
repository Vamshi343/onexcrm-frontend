// src/config/apiRoutes.ts

//export const API_BASE_URL = "http://localhost:3500";
//export const API_BASE_URL = "http://192.168.1.4:3500";

export const API_BASE_URL =
  "https://onexcrm-backend.onrender.com";



const USER_BASE = "/api/user";
const CONTACT_BASE = "/api/contact";
const DASHBOARD_BASE = "/api/dashboard";
const CATEGORY_BASE = "/api/category";
const SUBCATEGORY_BASE = "/api/subcategory";
const COMMON_BASE = "/api/common";

export const API_ROUTES = {
  USER: {
    LOGIN: `${USER_BASE}/authenticate`,
    REGISTER: `${USER_BASE}/registerUser`,
    CHANGE_PASSWORD: `${USER_BASE}/userChangePassword`,
    FORGOT_PASSWORD: `${USER_BASE}/userForgotPassword`,
    RESET_PASSWORD: `${USER_BASE}/userResetPassword`,
  },

  CONTACT: {
    GET_ALL: `${CONTACT_BASE}/getAllContacts`,
    GET_ONE: (id: number | string) =>
      `${CONTACT_BASE}/getContact/${id}`,

    SAVE: `${CONTACT_BASE}/saveContact`,
    DELETE: `${CONTACT_BASE}/deleteContact`,

    GET_VISITS: (contactId: number | string) =>
      `${CONTACT_BASE}/getVisitDetails/${contactId}`,

    SAVE_VISIT: `${CONTACT_BASE}/saveVisitDetails`,
    SEARCH_MOBILE: `${CONTACT_BASE}/searchMobile`,
  },

  CATEGORY: {
    GET_ALL: `${CATEGORY_BASE}/getAllCategories`,
    SAVE: `${CATEGORY_BASE}/saveCategory`,
    DELETE: `${CATEGORY_BASE}/deleteCategory`,
  },

  SUBCATEGORY: {
    GET_ALL: `${SUBCATEGORY_BASE}/getAllSubcategories`,
    SAVE: `${SUBCATEGORY_BASE}/saveSubcategory`,
    DELETE: `${SUBCATEGORY_BASE}/deleteSubcategory`,
  },

  COMMON: {
    GET_CATEGORIES: `${COMMON_BASE}/getAllCategory`,
    SAVE_CATEGORY: `${COMMON_BASE}/saveCategory`,
    DELETE_CATEGORY: `${COMMON_BASE}/deleteCategory`,
    
    GET_SUBCATEGORIES: `${COMMON_BASE}/getAllSubcategory`,
    SAVE_SUBCATEGORY: `${COMMON_BASE}/saveSubcategory`,
    DELETE_SUBCATEGORY: `${COMMON_BASE}/deleteSubcategory`,
  },
  COMMON_SEARCH: {
    BY_NOTES: `${COMMON_BASE}/searchByNotes`,
  },

  DASHBOARD: {
    STATS: `${DASHBOARD_BASE}/getStats`,
    ANALYTICS: `${DASHBOARD_BASE}/getAnalytics`,
    SEARCH_INTEREST: "/api/dashboard/searchInterest",
  },
};


































































// // src/config/apiRoutes.ts

// export const API_BASE_URL = "http://localhost:3500";

// export const API_ROUTES = {
//   AUTH: {
//     LOGIN: "/api/user/authenticate",
//     REGISTER: "/api/user/registerUser",
//     CHANGE_PASSWORD: "/api/user/userChangePassword",
//     FORGOT_PASSWORD: "/api/user/userForgotPassword",
//     RESET_PASSWORD: "/api/user/userResetPassword",
//   },
//   DASHBOARD: {
//   STATS: "/api/contact/getStats",
//   ANALYTICS: "/api/contact/getDashboardAnalytics",
// },


//   CATEGORY: {
//     GET_ALL: "/api/common/getAllCategory",
//     SAVE: "/api/common/saveCategory",
//     DELETE: "/api/common/deleteCategory",
//   },

//   SUBCATEGORY: {
//     GET_ALL: "/api/common/getAllSubcategory",
//     SAVE: "/api/common/saveSubcategory",
//     DELETE: "/api/common/deleteSubcategory",
//   },

//   CONTACT: {
//     GET_ALL: "/api/contact/getAllContacts",
//     GET_ONE: (id: number | string) => `/api/contact/getContact/${id}`,
//     SAVE: "/api/contact/saveContact",
//     DELETE: "/api/contact/deleteContact",

//     // visit
//     SAVE_VISIT: "/api/contact/saveContactVisit",
//     UPDATE_VISIT: "/api/contact/updateContactVisit",

//     SEARCH_MOBILE: (mobile: string) => `/api/contact/searchMobile/${mobile}`,
//   },

//   LEAD: {
//     GET_ALL: "/api/contact/getAllLeads",
//     GET_ONE: (id: number | string) => `/api/contact/getLead/${id}`,
//     SAVE: "/api/contact/saveLead",
//     DELETE: "/api/contact/deleteLead",

//     // visit
//     SAVE_VISIT: "/api/contact/saveLeadVisit",
//     UPDATE_VISIT: "/api/contact/updateLeadVisit",

//     // conversion
//     CONVERT_TO_CONTACT: "/api/contact/convertLeadToContact",
//   },

//   COMMON_SEARCH: {
//      BY_MOBILE: "/api/common/searchContact", // returns: contact OR lead OR null
//      BY_MOBILE_FN: (mobile: string) => `/api/common/searchContact/${mobile}`,

//     BY_NOTES: "/api/contact/searchByNotes", // for future WhatsApp campaigns
//     INTEREST: "/api/contact/searchInterest",
//   },

  

// };
