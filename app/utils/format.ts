export const getFormattedTime = (date: string) => {
  const list = new Date(date).toLocaleTimeString().split(":");
  const hour = +list[0] > 12 ? +list[0] - 12 : +list[0];
  const min = list[1];
  const isAm = +list[0] <= 12;

  return `${hour}:${min} ${isAm ? "AM" : "PM"}`;
};
