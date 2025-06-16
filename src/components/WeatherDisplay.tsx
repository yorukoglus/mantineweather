"use client";

import { memo } from "react";
import { Card, Grid, Stack, Text, Group, Badge } from "@mantine/core";
import { WeatherData } from "@/services/weatherService";
import { weatherService } from "@/services/weatherService";

interface WeatherDisplayProps {
  weather: WeatherData;
}

export const WeatherDisplay = memo(function WeatherDisplay({
  weather,
}: WeatherDisplayProps) {
  return (
    <Card p="md" mt="md" withBorder>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="xs">
            <Text size="xl" fw={500}>
              {weather.location.name}, {weather.location.country}
            </Text>
            <Text size="sm" c="dimmed">
              Son güncelleme:{" "}
              {new Date(weather.location.localtime).toLocaleString("tr-TR")}
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
                <Text size="xl">{Math.round(weather.current.temp_c)}°C</Text>
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
                Hissedilen: {Math.round(weather.current.feelslike_c)}°C
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
            <Group>
              <Badge size="lg" variant="light">
                UV İndeksi: {weather.current.uv}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Koordinatlar: {weather.location.lat.toFixed(2)},{" "}
              {weather.location.lon.toFixed(2)}
            </Text>
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );
});
