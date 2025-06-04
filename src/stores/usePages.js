import { url } from "@/plugins/baseUrl";
import { defineStore } from "pinia";
import { useAxios } from "@vueuse/integrations/useAxios";

export const usePagesStore = defineStore("usePages", () => {
  const baseUrl = url;

  // For fetching all pages
  const { 
    execute: fetchPages, 
    isLoading: loadingPages, 
    data: pagesData, 
    error: pagesError 
  } = useAxios(
    `${url}/pages`,
    { method: "GET" },
    { immediate: false }
  );

  // For fetching single page
  const { 
    execute: fetchPage, 
    isLoading: loadingPage, 
    data: pageData, 
    error: pageError 
  } = useAxios(
    "", 
    { method: "GET" },
    { immediate: false }
  );

  return {
    baseUrl,
    fetchPages,
    loadingPages,
    pagesData,
    pagesError,
    
    fetchPage,
    loadingPage, 
    pageData,
    pageError
  };
});