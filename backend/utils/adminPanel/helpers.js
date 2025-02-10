import { REGISTERD_MODELS } from "../../Configurations/adminConfig.js";

export const getRegisterdModels = () => {
  return [...new Set(REGISTERD_MODELS.map((model) => model.toLowerCase()))]
    .filter((model) => model !== "model" || model !== "modelField")
    .map((model) => model.charAt(0).toUpperCase() + model.slice(1));
};
