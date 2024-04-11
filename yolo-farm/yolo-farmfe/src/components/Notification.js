import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'; 
export function Notification() {
  return (
    <Card className="mt-6 w-full shadow-none border-2">
      <CardBody>
        <Typography variant="h5" align="center" color="blue-gray" className="mb-2 font-normal">
            <NotificationsNoneIcon className="me-2"></NotificationsNoneIcon>
            Thông báo
        </Typography>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <Typography>
            Text hereee
            </Typography>
        </div>
      </CardBody>
    </Card>
  );
}