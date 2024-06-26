import { Stack, Avatar, Tooltip, Typography, IconButton } from '@mui/material';
import Link from '../common/Link';
import { ROUTES } from '../../constants/routes';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { useNavigate } from 'react-router-dom';
import { useIsActive } from '../../hooks/ui/isActive';
import { useAppSelector } from '../../store';
import { stringAvatar } from '../../utils/colors';

const TABS = [
  {
    title: 'New group',
    Icon: DriveFileRenameOutlineIcon,
    route: ROUTES.CREATE_GROUP,
  },
  {
    title: 'Friends',
    Icon: PeopleOutlineIcon,
    route: ROUTES.FRIENDS,
  },
  {
    title: 'Chat',
    Icon: ChatBubbleOutlineIcon,
    route: ROUTES.ROOT,
  },
  {
    title: 'Other pages',
    Icon: BackupTableIcon,
    route: ROUTES.PAGES,
  },
];

const Sidebar = () => {
  const user = useAppSelector((state) => state.user.info);
  const navigate = useNavigate();
  const isActive = useIsActive();

  return (
    <Stack sx={{ width: '100px', bgcolor: 'common.white', height: '100%' }}>
      <Stack alignItems="center" mt="25px">
        <Link to={ROUTES.ROOT}>
          <TouchAppIcon fontSize="large" />
        </Link>
      </Stack>

      <Stack sx={{ height: '100%' }} alignItems="center" justifyContent="center">
        {TABS.map(({ Icon, title, route }) => (
          <Tooltip arrow placement="right" key={title} title={<Typography>{title}</Typography>}>
            <IconButton onClick={() => navigate(route)} sx={{ mb: '30px' }}>
              <Icon fontSize="medium" color={isActive(route) ? 'primary' : 'action'} />
            </IconButton>
          </Tooltip>
        ))}
      </Stack>

      {user && (
        <Stack alignItems="center" mb="25px">
          <Tooltip arrow followCursor placement="top" title={<Typography>{user.email}</Typography>}>
            <Avatar {...stringAvatar(user.username)} />
          </Tooltip>
        </Stack>
      )}
    </Stack>
  );
};

export default Sidebar;
