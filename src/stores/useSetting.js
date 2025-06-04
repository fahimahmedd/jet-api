import { url } from "@/plugins/baseUrl";
import { defineStore } from "pinia";
import { useAxios } from "@vueuse/integrations/useAxios";

export const useSettingStore = defineStore("useSetting", () => {
  const { 
    execute: fetchSettings, 
    isLoading: loadingSettings, 
    data: settingsData, 
    error: settingsError 
  } = useAxios(
    `${url}/setting`,
    { method: "GET" },
    { immediate: false }
  );

  return {
    fetchSettings,
    loadingSettings,
    settingsData,
    settingsError
  };
});