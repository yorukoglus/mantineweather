import {
  Card,
  Stack,
  Text,
  Group,
  Progress,
  Badge,
  Tooltip,
} from "@mantine/core";
import { WeatherData } from "@/services/weatherService";

interface AirQualityCardProps {
  data: WeatherData;
}

export function AirQualityCard({ data }: AirQualityCardProps) {
  const { air_quality } = data.current;

  const getAQIColor = (value: number) => {
    if (value <= 50) return "green";
    if (value <= 100) return "yellow";
    if (value <= 150) return "orange";
    if (value <= 200) return "red";
    if (value <= 300) return "purple";
    return "gray";
  };

  const getAQIDescription = (value: number) => {
    if (value <= 50) return "İyi";
    if (value <= 100) return "Orta";
    if (value <= 150) return "Hassas Gruplar İçin Sağlıksız";
    if (value <= 200) return "Sağlıksız";
    if (value <= 300) return "Çok Sağlıksız";
    return "Tehlikeli";
  };

  const pollutants = [
    {
      name: "PM2.5",
      value: air_quality.pm2_5,
      unit: "μg/m³",
      description: "İnce partikül madde",
    },
    {
      name: "PM10",
      value: air_quality.pm10,
      unit: "μg/m³",
      description: "Kaba partikül madde",
    },
    {
      name: "O3",
      value: air_quality.o3,
      unit: "ppb",
      description: "Ozon",
    },
    {
      name: "NO2",
      value: air_quality.no2,
      unit: "ppb",
      description: "Azot dioksit",
    },
    {
      name: "SO2",
      value: air_quality.so2,
      unit: "ppb",
      description: "Kükürt dioksit",
    },
    {
      name: "CO",
      value: air_quality.co,
      unit: "ppm",
      description: "Karbon monoksit",
    },
  ];

  const aqiIndex = air_quality["us-epa-index"];
  const aqiColor = getAQIColor(aqiIndex);
  const aqiDescription = getAQIDescription(aqiIndex);

  return (
    <Card withBorder shadow="sm" radius="md" p="lg">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Text size="lg" fw={500}>
            Hava Kalitesi
          </Text>
          <Badge size="lg" color={aqiColor}>
            {aqiDescription} ({aqiIndex})
          </Badge>
        </Group>

        <Stack gap="xs">
          {pollutants.map((pollutant) => (
            <Tooltip
              key={pollutant.name}
              label={`${pollutant.description}: ${pollutant.value} ${pollutant.unit}`}
              position="top"
            >
              <Stack gap={4}>
                <Group justify="space-between">
                  <Text size="sm">{pollutant.name}</Text>
                  <Text size="sm" fw={500}>
                    {pollutant.value} {pollutant.unit}
                  </Text>
                </Group>
                <Progress
                  value={(pollutant.value / 100) * 100}
                  color={getAQIColor(pollutant.value)}
                  size="sm"
                />
              </Stack>
            </Tooltip>
          ))}
        </Stack>

        <Text size="xs" c="dimmed" ta="center">
          Veriler US EPA standartlarına göre değerlendirilmiştir
        </Text>
      </Stack>
    </Card>
  );
}
