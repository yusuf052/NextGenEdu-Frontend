export const formatDateTime = (date) => {
    const updateTime = new Date(date);
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return updateTime.toLocaleDateString(undefined, options);
};