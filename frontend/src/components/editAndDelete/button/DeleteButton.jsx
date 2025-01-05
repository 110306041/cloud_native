import { DeleteRounded } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { grey, red } from "@mui/material/colors";

const DeleteButton = ({ title, onClick }) => {
  return (
    <Tooltip
      title={title}
      slotProps={{
        transition: {
          style: {
            margin: -0.01,
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
            color: red[400],
            bgcolor: "action.hover",
          },
        }}
        onClick={onClick}
      >
        <DeleteRounded />
      </IconButton>
    </Tooltip>
  );
};

export default DeleteButton