import {create} from "zustand";
import { SearchResultModel } from "../model/SearchModel";

interface SearchResultText {
    result: string;
    setResult: (result: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    searchResult: SearchResultModel | null;
    setSearchResult: (searchResult: SearchResultModel | null) => void;
  }
  
  export const useSearchResultStore = create<SearchResultText>((set) => ({
    result: '',
    setResult: (result) => set({ result, loading: true }),
    loading: false,
    setLoading: (loading) => set({ loading }),
    searchResult: null,
    setSearchResult: (searchResult) => set({ searchResult, loading: false }),
  }));