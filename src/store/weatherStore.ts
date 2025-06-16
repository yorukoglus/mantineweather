import { create } from 'zustand';
import { MarineData } from '@/services/weatherService';

interface WeatherState {
  marineData: MarineData | null;
  setMarineData: (data: MarineData | null) => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  marineData: null,
  setMarineData: (data) => set({ marineData: data }),
})); 