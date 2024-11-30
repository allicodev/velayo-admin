import {
  useDispatch as nativeUseDispatch,
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useDispatch = nativeUseDispatch.withTypes<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
