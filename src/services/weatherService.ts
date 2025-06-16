const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    humidity: number;
    pressure_mb: number;
    wind_kph: number;
    wind_degree: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
  };
}

export interface ForecastData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        avghumidity: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
      };
      hour: Array<{
        time: string;
        temp_c: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        wind_kph: number;
        humidity: number;
      }>;
    }>;
  };
}

export interface GeocodingData {
  name: string;
  lat: number;
  lon: number;
  country: string;
  region?: string;
}

export const weatherService = {
  async getCurrentWeatherByCity(city: string): Promise<WeatherData> {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=no&lang=tr`
    );
    if (!response.ok) {
      throw new Error('Hava durumu bilgisi alınamadı');
    }
    return response.json();
  },

  async getCurrentWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no&lang=tr`
    );
    if (!response.ok) {
      throw new Error('Hava durumu bilgisi alınamadı');
    }
    return response.json();
  },

  async getForecastByCity(city: string): Promise<ForecastData> {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no&lang=tr`
    );
    if (!response.ok) {
      throw new Error('Hava durumu tahmini alınamadı');
    }
    return response.json();
  },

  async getForecastByCoords(lat: number, lon: number): Promise<ForecastData> {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=5&aqi=no&lang=tr`
    );
    if (!response.ok) {
      throw new Error('Hava durumu tahmini alınamadı');
    }
    return response.json();
  },

  async getGeocoding(city: string): Promise<GeocodingData[]> {
    const response = await fetch(
      `${BASE_URL}/search.json?key=${API_KEY}&q=${city}&lang=tr`
    );
    if (!response.ok) {
      throw new Error('Konum bilgisi alınamadı');
    }
    return response.json();
  },

  getWeatherIcon(iconCode: string): string {
    // WeatherAPI.com ikonları için özel URL formatı
    return `https:${iconCode}`;
  },
}; 