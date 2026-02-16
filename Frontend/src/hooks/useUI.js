import { useContext } from "react";
import { UIContext } from "../context/UIContextDef";

export function useUI() {
  return useContext(UIContext);
}
