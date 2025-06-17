import { Stack, Group, Text, Badge, ScrollArea, Table } from "@mantine/core";
import { weatherService } from "@/services/weatherService";

export default function ForecastDetailModal({ day }: { day: any }) {
  return (
    <Stack gap="md">
      <Group>
        <img
          src={weatherService.getWeatherIcon(day.day.condition.icon)}
          alt={day.day.condition.text}
          style={{ width: 64, height: 64 }}
        />
        <Stack gap={0}>
          <Text size="lg" fw={500}>
            {day.day.condition.text}
          </Text>
          <Text size="sm" c="dimmed">
            Günlük Ortalama: {Math.round(day.day.avgtemp_c)}°C
          </Text>
        </Stack>
      </Group>
      <Group gap="xs">
        <Badge>Max: {Math.round(day.day.maxtemp_c)}°C</Badge>
        <Badge>Min: {Math.round(day.day.mintemp_c)}°C</Badge>
        <Badge>Nem: {day.day.avghumidity}%</Badge>
        <Badge>Rüzgar: {day.day.maxwind_kph} km/s</Badge>
        <Badge>UV: {day.day.uv}</Badge>
        <Badge>Yağış: {day.day.totalprecip_mm} mm</Badge>
      </Group>
      {day.astro && (
        <Stack gap={0}>
          <Text fw={500}>Güneş & Ay</Text>
          <Group gap="xs">
            <Badge>Güneş Doğuşu: {day.astro.sunrise}</Badge>
            <Badge>Güneş Batışı: {day.astro.sunset}</Badge>
            <Badge>Ay Doğuşu: {day.astro.moonrise}</Badge>
            <Badge>Ay Batışı: {day.astro.moonset}</Badge>
            <Badge>Ay Evresi: {day.astro.moon_phase}</Badge>
            <Badge>Aydınlanma: {day.astro.moon_illumination}%</Badge>
          </Group>
        </Stack>
      )}
      <Text fw={500} mt="md">
        Saatlik Tahmin
      </Text>
      <ScrollArea h={400}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Saat</Table.Th>
              <Table.Th>Durum</Table.Th>
              <Table.Th>Sıcaklık</Table.Th>
              <Table.Th>Nem</Table.Th>
              <Table.Th>Rüzgar</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {day.hour.map((h: any) => (
              <Table.Tr key={h.time}>
                <Table.Td>{h.time.split(" ")[1]}</Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <img
                      src={weatherService.getWeatherIcon(h.condition.icon)}
                      alt={h.condition.text}
                      width={24}
                      height={24}
                    />
                    <span>{h.condition.text}</span>
                  </Group>
                </Table.Td>
                <Table.Td>{Math.round(h.temp_c)}°C</Table.Td>
                <Table.Td>{h.humidity}%</Table.Td>
                <Table.Td>{h.wind_kph} km/s</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Stack>
  );
}
