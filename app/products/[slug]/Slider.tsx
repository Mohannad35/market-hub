import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Image } from "@nextui-org/image";
import { cn } from "@nextui-org/system";
import { Flex } from "@radix-ui/themes";
import NextImage from "next/image";
import { useCallback, useEffect, useState } from "react";

export function Slider({ items }: { items: { id: number; url: string }[] }) {
  const [emblaMainApi, setEmblaMainApi] = useState<CarouselApi>();
  const [emblaThumbsApi, setEmblaThumbsApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  return (
    <Flex direction={"row"} gap="1rem">
      <Carousel
        setApi={setEmblaThumbsApi}
        opts={{ align: "start", containScroll: "keepSnaps", dragFree: true }}
        className="w-full max-w-[5rem]"
        orientation="vertical"
      >
        <CarouselContent className="-mt-1 h-[30rem]">
          {items.map((item, index) => (
            <CarouselItem key={index} className="basis-1/5">
              <button onClick={() => onThumbClick(index)} className="w-[5rem]">
                <Image
                  width={720}
                  height={720}
                  shadow="none"
                  radius="none"
                  src={item.url}
                  alt=""
                  className={cn(
                    "max-h-[5rem] object-contain",
                    selectedIndex === index ? "!opacity-100" : "!opacity-50"
                  )}
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Flex direction={"column"} gap="1rem">
        <Carousel setApi={setEmblaMainApi} className="w-full max-w-sm">
          <CarouselContent>
            {items.map((item, index) => (
              <CarouselItem key={index}>
                <Image
                  as={NextImage}
                  width={720}
                  height={720}
                  shadow="none"
                  radius="none"
                  className="max-h-[30rem] object-contain"
                  src={item.url}
                  alt=""
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </Flex>
    </Flex>
  );
}
