export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Intl.DateTimeFormat('id-IN', options).format(new Date(dateString));
};
