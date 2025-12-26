import FolderOffRoundedIcon from "@mui/icons-material/FolderOffRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import { Box, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import type { FC } from "react";

export interface commonImageBoxProps {
  url: string;
  label: string;
  type: "image" | "pdf";
  grid?: object | number;
}

const CommonImageBox: FC<commonImageBoxProps> = ({ url, label, type ,grid}) => {
  const displayFile =
    type === "image" ? (
      <img src={url} alt={"Image"} className="object-cover w-full h-full rounded-md" />
    ) : (
      <Link to={url} target="_blank">
        <PictureAsPdfRoundedIcon className="text-7xl!" />
      </Link>
    );
  return (
    <Grid size={grid} className="flex! flex-col! justify-center! items-center! gap-2">
      {label && <p>{label}</p>}
      <Box className="flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden" sx={{ width: 150, height: 150 }}>
        {url ? displayFile : <FolderOffRoundedIcon className="text-7xl!" />}
      </Box>
    </Grid>
  );
};

export default CommonImageBox;

// const CommonImageBox = ({ url, label = "Profile", type = "upload", fileType = "image", required }) => {
//   const image = `${ImagePath}user/1.jpg`;
//   const isUpload = type === `upload` ? true : false;
//   const isImage = fileType === "image" ? <img src={image} alt={"Image"} className="object-cover w-full h-full rounded-md" /> : <PictureAsPdfRoundedIcon className="text-7xl!" />;
//   return (
//     <div>
//       <Grid size={{ xs: 12, md: 6 }} className="flex! flex-col! max-sm:justify-center! max-sm:items-center! ">
//         {label && <p>{label}</p>}
//         <Box className="flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden" sx={{ width: 150, height: 150 }}>
//           {image ? isImage : isUpload ? <FolderOffRoundedIcon className="text-7xl!" /> : <CloudUploadRoundedIcon className="text-7xl!" />}
//         </Box>
//       </Grid>
//     </div>
//   );
// };

// export default CommonImageBox;
