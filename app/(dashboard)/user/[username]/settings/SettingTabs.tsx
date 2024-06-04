"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { Flex } from "@radix-ui/themes";
import { useState } from "react";
import ProfileTabForm from "./ProfileTab";
import SecurityTabForm from "./SecurityTab";
import AccountTab from "./AccountTab";
import VendorTabForm from "./VendorTab";

const SettingTabs = ({ username }: { username: string }) => {
  const [selectedTab, setSelectedTab] = useState<string | number>("profile");

  return (
    <Flex direction="column" width="42rem">
      <Tabs
        defaultSelectedKey={"profile"}
        // size="lg"
        aria-label="Settings tabs"
        color="default"
        // variant="underlined"
        fullWidth
        selectedKey={selectedTab}
        onSelectionChange={setSelectedTab}
      >
        <Tab key="profile" title="Profile">
          <ProfileTabForm username={username} />
        </Tab>
        <Tab key="account" title="Account">
          <Flex direction="column" gap="3">
            <AccountTab username={username} />
          </Flex>
        </Tab>
        <Tab key="security" title="Security">
          <Flex direction="column" gap="3">
            <SecurityTabForm />
          </Flex>
        </Tab>
        <Tab key="vendorDetails" title="Vendor Details">
          <Flex direction="column" gap="3">
            <VendorTabForm username={username} />
          </Flex>
        </Tab>
      </Tabs>
    </Flex>
  );
};

export default SettingTabs;
