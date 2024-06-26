"use client";

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Image } from "@nextui-org/image";
import { cn } from "@nextui-org/system";
import { Flex } from "@radix-ui/themes";
import NextImage from "next/image";
import { useCallback, useEffect, useState } from "react";

export function Slider({ items }: { items: { public_id: string; secure_url: string }[] }) {
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
    <Flex direction="row" gap="0.5rem">
      <Carousel
        setApi={setEmblaThumbsApi}
        opts={{ align: "start", containScroll: "keepSnaps", dragFree: true }}
        className="w-full max-w-[3rem]"
        orientation="vertical"
      >
        <CarouselContent className="-mt-4 h-[30rem]">
          {items.map((item, index) => (
            <CarouselItem key={index} className="basis-1/12">
              <button onClick={() => onThumbClick(index)} className="w-[3rem]">
                <Image
                  width={720}
                  height={720}
                  shadow="none"
                  radius="none"
                  src={item.secure_url}
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
        <Carousel setApi={setEmblaMainApi} className="w-full">
          <CarouselContent>
            {items.map((item, index) => (
              <CarouselItem key={index}>
                <Image
                  as={NextImage}
                  width={720}
                  height={720}
                  shadow="none"
                  radius="none"
                  className="object-contain"
                  src={item.secure_url}
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
