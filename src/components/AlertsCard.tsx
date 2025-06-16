import {
  Card,
  Stack,
  Text,
  Group,
  Badge,
  Accordion,
  Alert,
} from "@mantine/core";
import { AlertData } from "@/services/weatherService";
import { IconAlertTriangle, IconInfoCircle } from "@tabler/icons-react";

interface AlertsCardProps {
  data: AlertData;
}

export function AlertsCard({ data }: AlertsCardProps) {
  const { alerts } = data;

  const getSeverityColor = (severity: string) => {
    const colors: { [key: string]: string } = {
      Extreme: "red",
      Severe: "orange",
      Moderate: "yellow",
      Minor: "blue",
      Unknown: "gray",
    };
    return colors[severity] || "gray";
  };

  const getUrgencyColor = (urgency: string) => {
    const colors: { [key: string]: string } = {
      Immediate: "red",
      Expected: "orange",
      Future: "yellow",
      Past: "blue",
      Unknown: "gray",
    };
    return colors[urgency] || "gray";
  };

  if (!alerts.alert || alerts.alert.length === 0) {
    return (
      <Card withBorder shadow="sm" radius="md" p="lg">
        <Stack gap="md">
          <Group gap="xs">
            <IconInfoCircle size={24} color="blue" />
            <Text size="lg" fw={500}>
              Hava Durumu Uyarıları
            </Text>
          </Group>
          <Text c="dimmed" ta="center">
            Şu anda aktif hava durumu uyarısı bulunmamaktadır.
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card withBorder shadow="sm" radius="md" p="lg">
      <Stack gap="md">
        <Group gap="xs">
          <IconAlertTriangle size={24} color="red" />
          <Text size="lg" fw={500}>
            Hava Durumu Uyarıları
          </Text>
        </Group>

        <Accordion>
          {alerts.alert.map((alert, index) => (
            <Accordion.Item key={index} value={`alert-${index}`}>
              <Accordion.Control>
                <Group gap="xs" wrap="nowrap">
                  <Text size="sm" fw={500} lineClamp={1}>
                    {alert.headline}
                  </Text>
                  <Badge
                    color={getSeverityColor(alert.severity)}
                    variant="light"
                  >
                    {alert.severity}
                  </Badge>
                  <Badge color={getUrgencyColor(alert.urgency)} variant="light">
                    {alert.urgency}
                  </Badge>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="xs">
                  <Alert
                    color={getSeverityColor(alert.severity)}
                    variant="light"
                    title={alert.event}
                  >
                    <Stack gap="xs">
                      <Text size="sm">{alert.desc}</Text>
                      {alert.instruction && (
                        <Text size="sm" fw={500}>
                          Öneriler: {alert.instruction}
                        </Text>
                      )}
                      <Group gap="xs" wrap="nowrap">
                        <Badge variant="dot" color="blue">
                          Başlangıç:{" "}
                          {new Date(alert.effective).toLocaleString("tr-TR")}
                        </Badge>
                        <Badge variant="dot" color="red">
                          Bitiş:{" "}
                          {new Date(alert.expires).toLocaleString("tr-TR")}
                        </Badge>
                      </Group>
                      <Group gap="xs">
                        <Badge variant="light" color="grape">
                          Kategori: {alert.category}
                        </Badge>
                        <Badge variant="light" color="violet">
                          Kesinlik: {alert.certainty}
                        </Badge>
                      </Group>
                      {alert.areas && (
                        <Text size="xs" c="dimmed">
                          Etkilenen Bölgeler: {alert.areas}
                        </Text>
                      )}
                    </Stack>
                  </Alert>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Stack>
    </Card>
  );
}
