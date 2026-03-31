import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type LatLng = { lat: number; lng: number };

export interface LocationState {
  lastLocation: LatLng | null;
}

const STORAGE_KEY = "fuelmap:lastLocation";

function readLastLocationFromStorage(): LatLng | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LatLng>;
    if (typeof parsed.lat === "number" && typeof parsed.lng === "number") {
      return { lat: parsed.lat, lng: parsed.lng };
    }
    return null;
  } catch {
    return null;
  }
}

const initialState: LocationState = {
  lastLocation: readLastLocationFromStorage(),
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLastLocation: (state, action: PayloadAction<LatLng>) => {
      state.lastLocation = action.payload;
      // Persist for next visits.
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(action.payload)
        );
      }
    },
    clearLastLocation: (state) => {
      state.lastLocation = null;
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    },
  },
});

export const { setLastLocation, clearLastLocation } = locationSlice.actions;

export default locationSlice.reducer;

