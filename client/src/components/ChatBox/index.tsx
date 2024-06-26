import { Stack, Box, CircularProgress } from '@mui/material';
import { useAppSelector } from '../../store';
import Center from '../common/Center';
import Header from './Header';
import MessageBox from './MessageBox';
import Messages from './Messages';
import SelectChat from './SelectChat';

const ChatBox = () => {
  const messages = useAppSelector((state) => state.messages);

  return (
    <Box
      sx={{
        bgcolor: 'common.white',
        flex: 1,
        background: 'url(/images/chat-bg-pattern-dark.png)',
      }}
    >
      {messages.currRoom === null ? (
        <SelectChat />
      ) : messages.loading[messages.currRoom] ? (
        <Center>
          <CircularProgress />
        </Center>
      ) : (
        <Stack
          sx={{
            maxWidth: '1000px',
            mx: 'auto',
            px: '24px',
            height: '100%',
          }}
        >
          <Header />
          <Messages messages={messages.messages[messages.currRoom] || []} />
          <Box>
            <MessageBox />
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default ChatBox;
