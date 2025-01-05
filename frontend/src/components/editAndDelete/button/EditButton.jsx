import { EditRounded } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { grey } from "@mui/material/colors";

const EditButton = ({title, onClick}) => {
  return (
    <Tooltip
      title={title}
      slotProps={{
        transition: {
          style: {
            margin: -0.01, // 減少 tooltip 跟 button 間的距離
          },
        },
        tooltip: {
          sx: {
            bgcolor: grey[400],
          },
        },
      }}
    >
      <IconButton
        sx={{
          "&:hover": {
            color: "#445E93",
            bgcolor: "action.hover",
          },
        }}
        onClick={onClick}
      >
        <EditRounded />
      </IconButton>
    </Tooltip>
  );
};

export default EditButton