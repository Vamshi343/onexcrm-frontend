// src/services/contactService.ts
import apiClient from "./apiClient";
import { API_ROUTES } from "../config/apiRoutes";

const contactService = {
  getAll() {
    return apiClient.get(API_ROUTES.CONTACT.GET_ALL).then(r => r.data);
  },

  getById(id: number | string) {
    return apiClient.get(API_ROUTES.CONTACT.GET_ONE(id)).then(r => r.data);
  },

  save(data: any) {
    return apiClient.post(API_ROUTES.CONTACT.SAVE, data).then(r => r.data);
  },

  remove(id: number | string) {
    return apiClient.post(API_ROUTES.CONTACT.DELETE, { id }).then(r => r.data);
  },

  searchByMobile(mobile: string) {
    return apiClient
      .post(API_ROUTES.CONTACT.SEARCH_MOBILE, { mobile })
      .then(r => (r.data?.dataCount ? r.data.result[0] : null));
  },

  getVisits(contactId: number | string) {
    return apiClient
      .get(API_ROUTES.CONTACT.GET_VISITS(contactId))
      .then(r => r.data);
  },

  saveVisit(data: any) {
    return apiClient
      .post(API_ROUTES.CONTACT.SAVE_VISIT, data)
      .then(r => r.data);
  },
};

export default contactService;
