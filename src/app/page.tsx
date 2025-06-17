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
import {
  IconAlertCircle,
  IconSun,
  IconCalendar,
  IconMap,
} from "@tabler/icons-react";
import {
  weatherService,
  WeatherData,
  ForecastData,
  GeocodingData,
  AlertData,
  MarineData,
} from "@/services/weatherService";
import { AstronomyCard } from "@/components/AstronomyCard";
import { AirQualityCard } from "@/components/AirQualityCard";
import { SearchInput } from "@/components/SearchInput";
import { WeatherDisplay } from "@/components/WeatherDisplay";
import { ForecastDisplay } from "@/components/ForecastDisplay";
import { MarineCard } from "@/components/MarineCard";
import { useWeatherStore } from "@/store/weatherStore";
import { MapCard } from "@/components/MapCard";

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | undefined>();
  const [forecast, setForecast] = useState<ForecastData | undefined>();
  const [alerts, setAlerts] = useState<AlertData | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [locations, setLocations] = useState<GeocodingData[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>("weather");
  const [airQuality, setAirQuality] = useState<WeatherData | undefined>();
  const [coords, setCoords] = useState<{
    lat: number | null;
    lon: number | null;
  }>({ lat: null, lon: null });
  const setMarineData = useWeatherStore(
    (state: { setMarineData: (data: MarineData | null) => void }) =>
      state.setMarineData
  );

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

      const marineData = await weatherService.getMarine(
        weatherData.location.lat,
        weatherData.location.lon
      );
      setMarineData(marineData);

      const alertsData = await weatherService
        .getAlerts(city)
        .catch(() => undefined);
      setAlerts(alertsData);
    } catch (err) {
      console.error("Veri alınamadı:", err);
      setError("Hava durumu verileri alınamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
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

      setCoords({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });

      const weatherData = await weatherService.getCurrentWeatherByCoords(
        position.coords.latitude,
        position.coords.longitude
      );

      await fetchAllData(weatherData.location.name);
    } catch (err) {
      setError("Konum bilgisi alınamadı veya hava durumu verisi bulunamadı.");
      setCoords({ lat: null, lon: null });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLocationClick();
  }, []);

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
              <Tabs.Tab value="map" leftSection={<IconMap />}>
                Harita
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="weather">
              <Stack gap="md">
                {weather && <WeatherDisplay weather={weather} />}
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  {airQuality && <AirQualityCard data={airQuality} />}
                  <AstronomyCard alerts={alerts!} />
                </SimpleGrid>
                <MarineCard />
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="forecast">
              {forecast && <ForecastDisplay forecast={forecast} />}
            </Tabs.Panel>

            <Tabs.Panel value="map">
              <MapCard lat={coords.lat} lon={coords.lon} loading={loading} />
            </Tabs.Panel>
          </Tabs>
        )}
      </Stack>
    </Container>
  );
}
