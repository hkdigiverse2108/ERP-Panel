import { type FC } from "react";
import type { CommonProfileAvatarProps } from "../../Types";

const CommonProfileAvatar: FC<CommonProfileAvatarProps> = ({ fullName, profileImage, className }) => {
  const nameWords = fullName?.trim()?.split(/\s+/) || [];

  const firstInitial = nameWords?.[0]?.charAt(0) || "";
  const lastInitial = nameWords?.length > 1 ? nameWords[nameWords.length - 1]?.charAt(0) : "";

  const profileInitials = (firstInitial + lastInitial).toUpperCase();

  return <div className={`flex items-center justify-center rounded-full bg-brand-500 text-white overflow-hidden ${className}`}>{profileImage ? <img src={profileImage} alt="profile" className="w-full h-full object-cover" /> : <span className="font-semibold">{profileInitials}</span>}</div>;
};

export default CommonProfileAvatar;
