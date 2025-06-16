import { Card, Stack, Text, Group, Badge, Flex } from "@mantine/core";
import { AlertData, AstronomyData } from "@/services/weatherService";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { AlertsCard } from "./AlertsCard";

interface AstronomyCardProps {
  data: AstronomyData;
  alerts?: AlertData;
}

const moonPhasesTR: { [key: string]: string } = {
  "New Moon": "Yeni Ay",
  "Waxing Crescent": "Hilal (Büyüyen)",
  "First Quarter": "İlk Dördün",
  "Waxing Gibbous": "Şişkin Ay (Büyüyen)",
  "Full Moon": "Dolunay",
  "Waning Gibbous": "Şişkin Ay (Küçülen)",
  "Last Quarter": "Son Dördün",
  "Waning Crescent": "Hilal (Küçülen)",
};

export function AstronomyCard({ data, alerts }: AstronomyCardProps) {
  const { astro } = data.astronomy;

  const getMoonPhaseIcon = (phase: string) => {
    const phases: { [key: string]: string } = {
      "New Moon": "🌑",
      "Waxing Crescent": "🌒",
      "First Quarter": "🌓",
      "Waxing Gibbous": "🌔",
      "Full Moon": "🌕",
      "Waning Gibbous": "🌖",
      "Last Quarter": "🌗",
      "Waning Crescent": "🌘",
    };
    return phases[phase] || "🌑";
  };

  return (
    <Card withBorder shadow="sm" radius="md" p="lg">
      <Stack justify="space-between" style={{ height: "100%" }}>
        <Text size="lg" fw={500}>
          Astronomik Bilgiler
        </Text>

        <Flex gap="md">
          <Stack gap="xs" align="center">
            <IconSun size={24} color="orange" />
            <Text size="sm" fw={500}>
              Güneş
            </Text>
            <Badge variant="light" color="yellow">
              Doğuş: {astro.sunrise}
            </Badge>
            <Badge variant="light" color="orange">
              Batış: {astro.sunset}
            </Badge>
          </Stack>

          <Stack gap="xs" align="center">
            <IconMoon size={24} color="blue" />
            <Text size="sm" fw={500}>
              Ay
            </Text>
            <Badge variant="light" color="blue">
              Doğuş: {astro.moonrise}
            </Badge>
            <Badge variant="light" color="indigo">
              Batış: {astro.moonset}
            </Badge>
          </Stack>
          <Group gap="xs" align="center" justify="center">
            <Text size="xl">{getMoonPhaseIcon(astro.moon_phase)}</Text>
            <Stack gap={0}>
              <Text size="sm" fw={500}>
                {moonPhasesTR[astro.moon_phase] || astro.moon_phase}
              </Text>
              <Text size="xs" c="dimmed">
                Aydınlanma: {astro.moon_illumination}%
              </Text>
            </Stack>
          </Group>
        </Flex>
        {alerts && <AlertsCard data={alerts} />}
      </Stack>
    </Card>
  );
}
