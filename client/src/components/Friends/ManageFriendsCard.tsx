import React from 'react';
import { Stack, Typography, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import moment from 'moment';
import { useFriend } from '../../state/friend/hooks';
import Avatar, { avatarProps } from '../common/Avatar';
import { UsersRelation, UserWithRelation } from '../../state/users/reducer';
import { useAppSelector } from '../../store';

const ManageFriendsCard: React.FC<{
  user: UserWithRelation;
}> = ({ user }) => {
  const { username, isActive, updatedAt, id, email, relation } = user;
  return (
    <Stack direction="row" alignItems="center">
      <Avatar {...avatarProps(user)} />
      <Stack flexGrow={1} ml="8px">
        <Typography variant="body2" fontWeight={500} textTransform="capitalize">
          {username}
        </Typography>
        <Typography variant="caption" color="grey.500">
          {isActive ? email : 'Last seen ' + moment(updatedAt).fromNow()}
        </Typography>
      </Stack>
      <CardAction relation={relation} id={id} />
    </Stack>
  );
};

export default ManageFriendsCard;

const CardAction: React.FC<{ relation: UsersRelation; id: number }> = ({ relation, id }) => {
  const friendState = useAppSelector((state) => state.friend);
  const { addFriend, acceptFriend, removeFriend } = useFriend();

  switch (relation) {
    case UsersRelation.Friends:
      return (
        <LoadingButton
          loading={friendState.remove.loading[id] === true}
          onClick={() => {
            removeFriend(id);
          }}
          variant="outlined"
          color="error"
          size="small"
        >
          Remove
        </LoadingButton>
      );
    case UsersRelation.NotFriends:
      return (
        <LoadingButton
          loading={friendState.add.loading[id] === true}
          onClick={() => addFriend(id)}
          variant="outlined"
          size="small"
        >
          Add
        </LoadingButton>
      );
    case UsersRelation.PendingRequest:
      return (
        <LoadingButton
          loading={friendState.accept.loading[id] === true}
          onClick={() => acceptFriend(id)}
          variant="outlined"
          size="small"
        >
          Accept
        </LoadingButton>
      );
    case UsersRelation.PendingResponse:
      return (
        <Button variant="outlined" size="small" disabled>
          Sent
        </Button>
      );
    default:
      return null;
  }
};
