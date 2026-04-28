const DEFAULT_AVATAR = "/user.png";

const normalizeBaseUrl = (baseUrl = "") => baseUrl.replace(/\/+$/, "");

export const resolveAvatarSrc = (avatar, apiBaseUrl) => {
  if (!avatar || avatar === DEFAULT_AVATAR) {
    return DEFAULT_AVATAR;
  }

  if (/^https?:\/\//i.test(avatar) || avatar.startsWith("data:")) {
    return avatar;
  }

  if (avatar.startsWith("/")) {
    return `${normalizeBaseUrl(apiBaseUrl)}${avatar}`;
  }

  return avatar;
};

export const emitUserUpdated = () => {
  window.dispatchEvent(new Event("userUpdated"));
};
