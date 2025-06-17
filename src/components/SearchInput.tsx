"use client";

import { useState } from "react";
import {
  TextInput,
  Button,
  Group,
  Tooltip,
  ActionIcon,
  rem,
} from "@mantine/core";
import { IconSearch, IconCurrentLocation } from "@tabler/icons-react";
import { GeocodingData } from "@/services/weatherService";

interface SearchInputProps {
  searchAction: (city: string) => void;
  locationAction: () => void;
  loading?: boolean;
  locations?: GeocodingData[];
}

export function SearchInput({
  searchAction,
  locationAction,
  loading,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (!inputValue.trim()) return;
    searchAction(inputValue);
  };

  return (
    <Group>
      <TextInput
        placeholder="Şehir adı girin..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        style={{ flex: 1 }}
      />
      <Tooltip label="Konumumu Kullan">
        <ActionIcon
          variant="light"
          size="lg"
          onClick={locationAction}
          loading={loading}
        >
          <IconCurrentLocation size={rem(16)} />
        </ActionIcon>
      </Tooltip>
      <Button
        className="transition-all duration-500"
        leftSection={<IconSearch size={rem(16)} />}
        onClick={handleSearch}
        loading={loading}
        disabled={!inputValue.trim()}
      >
        Ara
      </Button>
    </Group>
  );
}
