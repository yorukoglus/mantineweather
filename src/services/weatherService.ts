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
    air_quality: {
      co: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      "us-epa-index": number;
      "gb-defra-index": number;
    };
    uv: number;
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

export interface AstronomyData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  astronomy: {
    astro: {
      sunrise: string;
      sunset: string;
      moonrise: string;
      moonset: string;
      moon_phase: string;
      moon_illumination: string;
    };
  };
}

export interface TimeZoneData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
    timezone_id: string;
    localtime_epoch: number;
    utc_offset: string;
  };
}

export interface HistoryData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
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
    }>;
  };
}

export interface FutureData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
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
    }>;
  };
}

export interface AlertData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  alerts: {
    alert: Array<{
      headline: string;
      msgtype: string;
      severity: string;
      urgency: string;
      areas: string;
      category: string;
      certainty: string;
      event: string;
      note: string;
      effective: string;
      expires: string;
      desc: string;
      instruction: string;
    }>;
  };
}

export const weatherService = {
  async getCurrentWeatherByCity(city: string): Promise<WeatherData> {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=yes&lang=tr`
    );
    if (!response.ok) {
      throw new Error('Hava durumu bilgisi alınamadı');
    }
    return response.json();
  },

  async getCurrentWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=yes&lang=tr`
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
    return `https:${iconCode}`;
  },

  async getAstronomy(city: string): Promise<AstronomyData> {
    const response = await fetch(
      `${BASE_URL}/astronomy.json?key=${API_KEY}&q=${city}&lang=tr`
    );
    if (!response.ok) {
      throw new Error('Astronomi bilgisi alınamadı');
    }
    return response.json();
  },

  



  async getTimeZone(city: string): Promise<TimeZoneData> {
    const response = await fetch(
      `${BASE_URL}/timezone.json?key=${API_KEY}&q=${city}&lang=tr`
    );
    if (!response.ok) {
      throw new Error('Saat dilimi bilgisi alınamadı');
    }
    return response.json();
  },

  async getHistory(city: string, date: string): Promise<HistoryData> {
    const response = await fetch(
      `${BASE_URL}/history.json?key=${API_KEY}&q=${city}&dt=${date}&lang=tr`
    );
    if (!response.ok) {
      throw new Error('Geçmiş hava durumu bilgisi alınamadı');
    }
    return response.json();
  },

  async getFuture(city: string, days: number = 14): Promise<FutureData> {
    const response = await fetch(
      `${BASE_URL}/future.json?key=${API_KEY}&q=${city}&days=${days}&lang=tr`
    );
    if (!response.ok) {
      throw new Error('Gelecek hava durumu bilgisi alınamadı');
    }
    return response.json();
  },

  async getAlerts(city: string): Promise<AlertData> {
    const response = await fetch(
      `${BASE_URL}/alerts.json?key=${API_KEY}&q=${city}&lang=tr`
    );
    if (!response.ok) {
      throw new Error('Hava durumu uyarıları alınamadı');
    }
    return response.json();
  },
}; 