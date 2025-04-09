export const handleFirebaseDate = (dateString: Date): Date => {
  const date = new Date(dateString);
  const dateDay = date.getDate();
  date.setDate(dateDay + 1);
  return date;
};
