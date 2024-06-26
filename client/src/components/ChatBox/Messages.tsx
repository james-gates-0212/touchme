import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import Message from './Message';
import { IMessage } from '../../state/messages/reducer';
import { groupUserMessages } from '../../utils/messages';

const Messages: React.FC<{ messages: IMessage[] }> = ({ messages }) => {
  const ref = useRef<HTMLDivElement>(null);
  const groupedMessages = groupUserMessages(messages);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
      ref={ref}
      sx={{
        overflowY: 'auto',
        mt: '2px',
        mb: '12px',
        '::-webkit-scrollbar': {
          display: 'none',
        },
        scrollBehavior: 'smooth',
        flexGrow: 1,
      }}
    >
      {groupedMessages.map((message, idx) => (
        <Message message={message} key={idx} />
      ))}
    </Box>
  );
};

export default Messages;
