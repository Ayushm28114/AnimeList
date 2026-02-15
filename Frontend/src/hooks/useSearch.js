import { useContext } from "react";
import { SearchContext } from "../context/SearchContextDef";

export function useSearch() {
  return useContext(SearchContext);
}
