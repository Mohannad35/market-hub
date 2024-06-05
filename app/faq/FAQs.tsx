"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Text } from "@radix-ui/themes";

const Faqs = [
  {
    title: "What is Market hub?",
    content: "Market hub is a platform that allows you to buy and sell products.",
  },
  {
    title: "How do I get started?",
    content: "You can get started by creating an account and listing your products.",
  },
  {
    title: "What is your refund policy?",
    content: "We have a 30-day refund policy.",
  },
  {
    title: "How do I contact support?",
    content: "You can contact support by sending an email to",
  },
  {
    title: "How do I change my password?",
    content: "You can change your password by going to your account settings.",
  },
  {
    title: "Do you offer free shipping?",
    content: "We offer free shipping on orders over $50.",
  },
  {
    title: "How do I track my order?",
    content: "You can track your order by going to your account settings > orders.",
  },
  {
    title: "Do you offer international shipping?",
    content: "Sadly, we do not offer international shipping at this time.",
  },
  {
    title: "Do you offer discount codes?",
    content:
      "We offer discount codes on special occasions and vendors can create their own discount codes.",
  },
  {
    title: "How do I become a vendor?",
    content: "You can become a vendor by going to your account settings > vendor settings.",
  },
];

const FAQs = () => {
  return (
    <Accordion>
      {Faqs.map(({ content, title }, index) => (
        <AccordionItem
          key={index}
          title={title}
          hideIndicator
          startContent={<Icon icon="ph:plus" fontSize={22} className="text-default-400" />}
          className="px-4 py-1"
        >
          <Text className="text-muted-foreground">{content}</Text>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FAQs;
