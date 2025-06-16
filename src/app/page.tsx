"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Stack,
  Tabs,
  Loader,
  Alert,
  SimpleGrid,
  Center,
} from "@mantine/core";
import { IconAlertCircle, IconSun, IconCalendar } from "@tabler/icons-react";
import {
  weatherService,
  WeatherData,
  ForecastData,
  GeocodingData,
  AstronomyData,
  AlertData,
} from "@/services/weatherService";
import { AstronomyCard } from "@/components/AstronomyCard";
import { AirQualityCard } from "@/components/AirQualityCard";
import { SearchInput } from "@/components/SearchInput";
import { WeatherDisplay } from "@/components/WeatherDisplay";
import { ForecastDisplay } from "@/components/ForecastDisplay";

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | undefined>();
  const [forecast, setForecast] = useState<ForecastData | undefined>();
  const [astronomy, setAstronomy] = useState<AstronomyData | undefined>(
    undefined
  );
  const [alerts, setAlerts] = useState<AlertData | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [locations, setLocations] = useState<GeocodingData[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>("weather");
  const [airQuality, setAirQuality] = useState<WeatherData | undefined>();

  useEffect(() => {
    if (weather?.location.name) {
      if (activeTab === "forecast") {
        fetchForecast(weather.location.name);
      } else if (activeTab === "details") {
        fetchDetails(weather.location.name);
      }
    }
  }, [activeTab, weather?.location.name]);

  useEffect(() => {
    handleLocationClick();
  }, []);

  const fetchAllData = async (city: string) => {
    setLoading(true);
    setError(undefined);
    try {
      const [weatherData, forecastData] = await Promise.all([
        weatherService.getCurrentWeatherByCity(city),
        weatherService.getForecastByCity(city),
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
      setAirQuality(weatherData);

      const [astronomyData, alertsData] = await Promise.all([
        weatherService.getAstronomy(city),
        weatherService.getAlerts(city).catch(() => undefined),
      ]);

      setAstronomy(astronomyData);
      setAlerts(alertsData);
    } catch (err) {
      console.error("Veri alınamadı:", err);
      setError("Hava durumu verileri alınamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async (city: string) => {
    if (!forecast) {
      setLoading(true);
      try {
        const forecastData = await weatherService.getForecastByCity(city);
        setForecast(forecastData);
      } catch (err) {
        console.error("Error fetching forecast data:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchDetails = async (city: string) => {
    if (!astronomy) {
      setLoading(true);
      try {
        const astronomyData = await weatherService
          .getAstronomy(city)
          .catch(() => undefined);

        setAstronomy(astronomyData);
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async (city: string) => {
    if (!city.trim()) return;

    try {
      const geoData = await weatherService.getGeocoding(city);
      setLocations(geoData);

      if (geoData.length > 0) {
        const firstResult = geoData[0];
        await fetchAllData(firstResult.region!);
      } else {
        setError("Şehir bulunamadı. Lütfen farklı bir şehir adı deneyin.");
      }
    } catch (err) {
      console.error("Arama hatası:", err);
      setError("Şehir araması yapılamadı. Lütfen tekrar deneyin.");
    }
  };

  const handleLocationClick = async () => {
    if (!navigator.geolocation) {
      setError("Tarayıcınız konum özelliğini desteklemiyor.");
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      const weatherData = await weatherService.getCurrentWeatherByCoords(
        position.coords.latitude,
        position.coords.longitude
      );

      await fetchAllData(weatherData.location.name);
    } catch (err) {
      setError("Konum bilgisi alınamadı veya hava durumu verisi bulunamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <SearchInput
          searchAction={handleSearch}
          locationAction={handleLocationClick}
          loading={loading}
          locations={locations}
        />

        {error && (
          <Alert color="red" title="Hata" icon={<IconAlertCircle />}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Center>
            <Loader size="lg" />
          </Center>
        ) : (
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="weather" leftSection={<IconSun />}>
                Hava Durumu
              </Tabs.Tab>
              <Tabs.Tab value="forecast" leftSection={<IconCalendar />}>
                Tahmin
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="weather">
              <Stack gap="md">
                {weather && <WeatherDisplay weather={weather} />}
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  {airQuality && <AirQualityCard data={airQuality} />}
                  {astronomy && (
                    <AstronomyCard data={astronomy} alerts={alerts} />
                  )}
                </SimpleGrid>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="forecast">
              {forecast && <ForecastDisplay forecast={forecast} />}
            </Tabs.Panel>
          </Tabs>
        )}
      </Stack>
    </Container>
  );
}
