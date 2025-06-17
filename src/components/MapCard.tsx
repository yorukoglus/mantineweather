import React from "react";
import { Loader, Center, Card } from "@mantine/core";

interface MapCardProps {
  lat: number | null;
  lon: number | null;
  loading: boolean;
}

export const MapCard: React.FC<MapCardProps> = ({ lat, lon, loading }) => {
  if (loading) {
    return (
      <Center style={{ minHeight: 300 }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (lat == null || lon == null) {
    return <Center>Konum alınamadı.</Center>;
  }

  const mapSrc = `https://www.google.com/maps?q=${lat},${lon}&z=15&output=embed`;

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <iframe
        title="Google Maps"
        width="100%"
        height="650"
        style={{ border: 0 }}
        src={mapSrc}
        allowFullScreen
      ></iframe>
    </Card>
  );
};
