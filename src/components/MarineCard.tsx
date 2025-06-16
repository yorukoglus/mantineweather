"use client";

import { memo, useState } from "react";
import {
  Card,
  Stack,
  Text,
  Group,
  Badge,
  Grid,
  Collapse,
  ActionIcon,
} from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useWeatherStore } from "@/store/weatherStore";
import { MarineData } from "@/services/weatherService";

interface Tide {
  tide_time: string;
  tide_height_mt: string;
  tide_type: "HIGH" | "LOW";
}

export const MarineCard = memo(function MarineCard() {
  const [opened, setOpened] = useState(true);
  const marineData = useWeatherStore(
    (state: { marineData: MarineData | null }) => state.marineData
  );

  if (!marineData) return null;

  const today = marineData.forecast.forecastday[0];
  const tides = today.day.tides[0]?.tide || [];

  return (
    <Card withBorder>
      <Group
        justify="space-between"
        onClick={() => setOpened((o) => !o)}
        style={{ cursor: "pointer" }}
      >
        <Text size="lg" fw={500}>
          Deniz Durumu
        </Text>

        <Text size="lg" fw={500}>
          Gelgit Bilgileri
        </Text>
        <ActionIcon variant="subtle">
          {opened ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
        </ActionIcon>
      </Group>
      <Collapse in={opened}>
        <Grid mt="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="xs">
              <Badge size="lg" variant="light">
                Su Sıcaklığı: {today.hour[0]?.water_temp_c}°C
              </Badge>
              <Badge size="lg" variant="light">
                Dalga Yüksekliği: {today.hour[0]?.swell_ht_mt}m
              </Badge>
              <Badge size="lg" variant="light">
                Dalga Periyodu: {today.hour[0]?.swell_period_secs}s
              </Badge>
              <Badge size="lg" variant="light">
                Dalga Yönü: {today.hour[0]?.swell_dir_16_point}
              </Badge>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="xs">
              {tides.map((tide: Tide, index: number) => (
                <Group key={index} gap="xs">
                  <Badge
                    size="lg"
                    variant="light"
                    color={tide.tide_type === "HIGH" ? "blue" : "gray"}
                  >
                    {tide.tide_type === "HIGH" ? "Yüksek" : "Alçak"}:{" "}
                    {new Date(tide.tide_time).toLocaleTimeString("tr-TR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Badge>
                  <Text size="sm" c="dimmed">
                    Yükseklik: {tide.tide_height_mt}m
                  </Text>
                </Group>
              ))}
            </Stack>
          </Grid.Col>
        </Grid>
      </Collapse>
    </Card>
  );
});
