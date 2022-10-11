import React from "react";
import { Stack, Box } from "@mui/material";
import Header from "./Header";
import MessageBox from "./MessageBox";
import Messages from "./Messages";

const ChatBox = () => {
  return (
    <Box sx={{ bgcolor: "common.white", flex: 1 }}>
      <Stack
        sx={{
          maxWidth: "1000px",
          mx: "auto",
          px: "24px",
          height: "100%",
        }}
      >
        <Header />
        <Messages />
        <Box sx={{ mt: "auto" }}>
          <MessageBox />
        </Box>
      </Stack>
    </Box>
  );
};

export default ChatBox;
