import { useState } from "react";
import { Drawer, Button, Accordion } from "@mantine/core";

const faqData = [
  {
    question: "Bu uygulama hangi verileri kullanıyor?",
    answer:
      "Uygulama, hava durumu ve konum verilerini WeatherAPI üzerinden alır. Kişisel verileriniz saklanmaz.",
  },
  {
    question: "Konumumu paylaşmak zorunda mıyım?",
    answer:
      "Hayır, dilerseniz şehir araması yaparak da hava durumu bilgisi alabilirsiniz.",
  },
  {
    question: "Veriler ne sıklıkla güncelleniyor?",
    answer:
      "Veriler her arama yaptığınızda veya sayfayı yenilediğinizde güncellenir.",
  },
  {
    question: "Hangi şehirler destekleniyor?",
    answer: "WeatherAPI'nin desteklediği tüm şehirler sorgulanabilir.",
  },
];

export default function FaqDrawer() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpened(true)}
        style={{ position: "fixed", bottom: 16, right: 16 }}
      >
        SSS
      </Button>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Sıkça Sorulan Sorular"
        position="right"
        size="md"
      >
        <Accordion>
          {faqData.map((item, idx) => (
            <Accordion.Item key={idx} value={item.question}>
              <Accordion.Control>{item.question}</Accordion.Control>
              <Accordion.Panel>{item.answer}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Drawer>
    </>
  );
}
