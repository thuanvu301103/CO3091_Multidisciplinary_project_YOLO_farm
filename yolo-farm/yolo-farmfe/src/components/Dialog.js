import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
export function Dialog() {
  return (
    <Card className="mt-6 w-full shadow-none border-2">
      <CardBody>
        <Typography variant="h5" align="center" color="blue-gray" className="mb-2 font-normal">
            <TextSnippetOutlinedIcon className="me-2"></TextSnippetOutlinedIcon>
            Nhật kí
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