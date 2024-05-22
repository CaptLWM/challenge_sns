import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import BoardCreateCard from "../_CommonComponent/BoardCreateCard";
import Boardlist from "./boardlist";
import FollowBoardlist from "./followBoardlist";

export default function Main() {
  return (
    <div>
      <BoardCreateCard />
      <Tabs>
        <TabList>
          <Tab>전체글</Tab>
          <Tab>팔로우</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Boardlist />
          </TabPanel>
          <TabPanel>
            <FollowBoardlist />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
