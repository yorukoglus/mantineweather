"use client";

import { memo } from "react";
import { Grid, Card, Stack, Text, Group, Badge } from "@mantine/core";
import { ForecastData } from "@/services/weatherService";
import { weatherService } from "@/services/weatherService";

interface ForecastDisplayProps {
  forecast: ForecastData;
}

export const ForecastDisplay = memo(function ForecastDisplay({
  forecast,
}: ForecastDisplayProps) {
  return (
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
                  src={weatherService.getWeatherIcon(day.day.condition.icon)}
                  alt={day.day.condition.text}
                  style={{
                    width: "64px",
                    height: "64px",
                    objectFit: "contain",
                  }}
                />
                <Text size="lg">{Math.round(day.day.avgtemp_c)}°C</Text>
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
  );
});
