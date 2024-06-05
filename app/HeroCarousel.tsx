"use client";

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Image } from "@nextui-org/react";
import { Flex } from "@radix-ui/themes";
import React, { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { DotButton, useDotButton } from "./HeroCarouselDotButton";
import { EmblaCarouselType } from "embla-carousel";
import { cn } from "@/lib/utils";

const items = [
  {
    alt: "Accessories",
    secure_url:
      "https://res.cloudinary.com/dsjpljjth/image/upload/v1711841734/samples/ecommerce/accessories-bag.jpg",
  },
  {
    alt: "Analog Classic watch",
    secure_url:
      "https://res.cloudinary.com/dsjpljjth/image/upload/v1711841725/samples/ecommerce/analog-classic.jpg",
  },
  {
    alt: "AI generated custom clothing store image",
    secure_url:
      "https://res.cloudinary.com/dsjpljjth/image/upload/v1717579920/samples/ecommerce/custom-clothing-store-img_lxq5k9.jpg",
  },
];

const HeroCarousel = () => {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [api, setApi] = useState<CarouselApi>();
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    api as EmblaCarouselType | undefined
  );

  useEffect(() => {
    if (!api) return;
  }, [api]);

  return (
    <Flex direction={"column"} gap="1rem" align="center">
      <Carousel setApi={setApi} className="w-full max-w-xs" plugins={[plugin.current]}>
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
                alt={item.alt}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex flex-wrap items-center justify-end gap-1">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={cn("h-[1rem] w-[1rem] cursor-pointer rounded-full", {
              "bg-foreground-50": selectedIndex !== index,
              "bg-foreground-200": selectedIndex === index,
            })}
          />
        ))}
      </div>
    </Flex>
  );
};

export default HeroCarousel;
