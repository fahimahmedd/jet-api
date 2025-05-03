import { url } from "@/plugins/baseUrl";
import { defineStore } from "pinia";
import { useAxios } from "@vueuse/integrations/useAxios";

export const useMyBookStore = defineStore("useMyBook", () => {
  const token = localStorage.getItem("token");
  
  const { execute: fetchBookings, isLoading: loading, data, error } = useAxios(
    `${url}/my-bookings`,
    { 
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    },
    { immediate: false }
  );

  return {
    bookings: data,
    loading,
    error,
    fetchBookings
  };
});