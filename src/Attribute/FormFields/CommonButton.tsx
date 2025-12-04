import type { ButtonProps } from "@mui/material";
import { Button } from "@mui/material";
import { type FC } from "react";

const CommonButton: FC<ButtonProps> = ({ children, loading = false, loadingPosition = "start", disabled, sx = {}, title, ...props }) => {
  return (
    <Button
      {...props}
      loading={loading}
      loadingPosition={loadingPosition}
      disabled={loading || disabled}
      sx={{
        textTransform: "none",
        borderRadius: 1.2,
        fontWeight: 500,
        gap: 1,
        height: props.size === "small" ? 36 : props.size === "large" ? 48 : 42,
        ...sx,
      }}
    >
      {children ? children : title}
    </Button>
  );
};

export default CommonButton;
