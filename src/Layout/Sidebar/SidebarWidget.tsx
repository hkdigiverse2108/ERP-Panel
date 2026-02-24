import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useAppSelector } from "../../Store/hooks";

const SidebarWidget = () => {
  const { adminSetting } = useAppSelector((state) => state.layout);

  const iconClass = "flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200";
  const iconMap: Record<string, React.ElementType> = {
    facebook: FacebookIcon,
    instagram: InstagramIcon,
    twitter: XIcon,
    linkedin: LinkedInIcon,
    youtube: YouTubeIcon,
    whatsapp: WhatsAppIcon,
  };
  return (
    <div className="mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-gray-dark">
      <p className="mb-4 text-gray-700 text-theme-sm dark:text-gray-400">Want insider tips & updates? Follow us:</p>

      <div className="flex justify-center items-center gap-2">
        {adminSetting?.links?.map((item, index) => {
          const IconComponent = iconMap[item?.icon?.toLowerCase() as keyof typeof iconMap];

          if (!IconComponent) return null;
          return (
            <a key={index} href={item.link} target="_blank" rel="noopener" className={iconClass}>
              <IconComponent fontSize="medium" />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarWidget;
