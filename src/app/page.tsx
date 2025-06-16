"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Title,
  TextInput,
  Button,
  Group,
  Paper,
  Text,
  Grid,
  Card,
  Image,
  Stack,
  Tabs,
  rem,
  Loader,
  Alert,
  Select,
  ActionIcon,
  Tooltip,
  Badge,
  Box,
} from "@mantine/core";
import {
  IconSearch,
  IconAlertCircle,
  IconCurrentLocation,
} from "@tabler/icons-react";
import {
  weatherService,
  WeatherData,
  ForecastData,
  GeocodingData,
} from "@/services/weatherService";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<GeocodingData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Önce şehir için geocoding yap
      const geoData = await weatherService.getGeocoding(city);
      setLocations(geoData);

      if (geoData.length === 0) {
        throw new Error("Şehir bulunamadı");
      }

      // İlk sonucu kullan
      const location = geoData[0];
      setSelectedLocation(`${location.name}, ${location.country}`);

      // Hava durumu verilerini al
      const [weatherData, forecastData] = await Promise.all([
        weatherService.getCurrentWeatherByCoords(location.lat, location.lon),
        weatherService.getForecastByCoords(location.lat, location.lon),
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError(
        "Hava durumu bilgisi alınamadı. Lütfen şehir adını kontrol edin."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = async () => {
    if (!navigator.geolocation) {
      setError("Tarayıcınız konum özelliğini desteklemiyor.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      const [weatherData, forecastData] = await Promise.all([
        weatherService.getCurrentWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude
        ),
        weatherService.getForecastByCoords(
          position.coords.latitude,
          position.coords.longitude
        ),
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
      setCity(weatherData.location.name);
      setSelectedLocation(
        `${weatherData.location.name}, ${weatherData.location.country}`
      );
    } catch (err) {
      setError("Konum bilgisi alınamadı veya hava durumu verisi bulunamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLocationClick();
  }, []);

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={1} ta="center">
          Hava Durumu Uygulaması
        </Title>

        <Group>
          <TextInput
            placeholder="Şehir adı girin..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ flex: 1 }}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Tooltip label="Konumumu Kullan">
            <ActionIcon
              variant="light"
              size="lg"
              onClick={handleLocationClick}
              loading={loading}
            >
              <IconCurrentLocation size={rem(16)} />
            </ActionIcon>
          </Tooltip>
          <Button
            leftSection={<IconSearch size={rem(16)} />}
            onClick={handleSearch}
            loading={loading}
          >
            Ara
          </Button>
        </Group>

        {locations.length > 0 && (
          <Select
            label="Konum Seçin"
            placeholder="Konum seçin..."
            data={locations.map((loc) => ({
              value: `${loc.name}, ${loc.country}`,
              label: `${loc.name}${loc.region ? `, ${loc.region}` : ""}, ${
                loc.country
              }`,
            }))}
            value={selectedLocation}
            onChange={setSelectedLocation}
            searchable
            clearable
          />
        )}

        {error && (
          <Alert icon={<IconAlertCircle size={rem(16)} />} color="red">
            {error}
          </Alert>
        )}

        {loading && (
          <Group justify="center" py="xl">
            <Loader size="lg" />
          </Group>
        )}

        {weather && (
          <Tabs defaultValue="current">
            <Tabs.List>
              <Tabs.Tab value="current">Güncel Hava Durumu</Tabs.Tab>
              <Tabs.Tab value="forecast">5 Günlük Tahmin</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="current">
              <Paper p="md" mt="md" withBorder>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="xs">
                      <Text size="xl" fw={500}>
                        {weather.location.name}, {weather.location.country}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Son güncelleme:{" "}
                        {new Date(weather.location.localtime).toLocaleString(
                          "tr-TR"
                        )}
                      </Text>
                      <Group>
                        <img
                          src={weatherService.getWeatherIcon(
                            weather.current.condition.icon
                          )}
                          alt={weather.current.condition.text}
                          style={{
                            width: "64px",
                            height: "64px",
                            objectFit: "contain",
                          }}
                        />
                        <Stack gap={0}>
                          <Text size="xl">
                            {Math.round(weather.current.temp_c)}°C
                          </Text>
                          <Text size="sm" c="dimmed">
                            {weather.current.condition.text}
                          </Text>
                        </Stack>
                      </Group>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="xs">
                      <Group>
                        <Badge size="lg" variant="light">
                          Hissedilen: {Math.round(weather.current.feelslike_c)}
                          °C
                        </Badge>
                        <Badge size="lg" variant="light">
                          Nem: {weather.current.humidity}%
                        </Badge>
                      </Group>
                      <Group>
                        <Badge size="lg" variant="light">
                          Rüzgar: {weather.current.wind_kph} km/s
                        </Badge>
                        <Badge size="lg" variant="light">
                          Basınç: {weather.current.pressure_mb} mb
                        </Badge>
                      </Group>
                      <Text size="sm" c="dimmed">
                        Koordinatlar: {weather.location.lat.toFixed(2)},{" "}
                        {weather.location.lon.toFixed(2)}
                      </Text>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="forecast">
              {forecast && (
                <Grid mt="md">
                  {forecast.forecast.forecastday.map((day) => (
                    <Grid.Col
                      key={day.date}
                      span={{ base: 12, xl: 3, lg: 3, sm: 6, md: 4 }}
                    >
                      <Card withBorder>
                        <Stack gap="xs" align="center">
                          <Text fw={500}>
                            {new Date(day.date).toLocaleDateString("tr-TR", {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            })}
                          </Text>
                          <Group gap="xs">
                            <img
                              src={weatherService.getWeatherIcon(
                                day.day.condition.icon
                              )}
                              alt={day.day.condition.text}
                              style={{
                                width: "64px",
                                height: "64px",
                                objectFit: "contain",
                              }}
                            />
                            <Text size="lg">
                              {Math.round(day.day.avgtemp_c)}°C
                            </Text>
                          </Group>
                          <Text size="sm" c="dimmed">
                            {day.day.condition.text}
                          </Text>
                          <Group gap="xs">
                            <Badge size="sm" variant="light">
                              Max: {Math.round(day.day.maxtemp_c)}°C
                            </Badge>
                            <Badge size="sm" variant="light">
                              Min: {Math.round(day.day.mintemp_c)}°C
                            </Badge>
                            <Badge size="sm" variant="light">
                              Nem: {day.day.avghumidity}%
                            </Badge>
                            <Badge size="sm" variant="light">
                              Rüzgar: {day.day.maxwind_kph}
                            </Badge>
                          </Group>
                        </Stack>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
              )}
            </Tabs.Panel>
          </Tabs>
        )}
      </Stack>
    </Container>
  );
}
