"use client";

import { memo } from "react";
import {
  Grid,
  Card,
  Stack,
  Text,
  Group,
  Badge,
  Modal,
  ScrollArea,
  useMantineColorScheme,
} from "@mantine/core";
import { ForecastData } from "@/services/weatherService";
import { weatherService } from "@/services/weatherService";
import { useState } from "react";
import ForecastDetailModal from "./ForecastDetailModal";
import styles from "./ForecastDisplay.module.css";

interface ForecastDisplayProps {
  forecast: ForecastData;
}

export const ForecastDisplay = memo(function ForecastDisplay({
  forecast,
}: ForecastDisplayProps) {
  const [opened, setOpened] = useState(false);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const { colorScheme } = useMantineColorScheme();

  const handleCardClick = (day: any) => {
    setSelectedDay(day);
    setOpened(true);
  };

  return (
    <Grid mt="md">
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          selectedDay
            ? new Date(selectedDay.date).toLocaleDateString("tr-TR", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })
            : ""
        }
        size="lg"
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {selectedDay && <ForecastDetailModal day={selectedDay} />}
      </Modal>
      {forecast.forecast.forecastday.map((day) => (
        <Grid.Col
          key={day.date}
          span={{ base: 12, xl: 3, lg: 3, sm: 6, md: 4 }}
        >
          <Card
            withBorder
            onClick={() => handleCardClick(day)}
            className={`${styles.card} ${
              colorScheme === "dark" ? styles.cardDark : styles.cardLight
            }`}
          >
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
