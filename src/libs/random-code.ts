export const randomCode = (length = 6) => {
  length = length === 0 ? 1 : length > 10 ? 10 : length;
  const randomNumber = Math.random() * Math.pow(10, length);
  const integer = Math.floor(randomNumber);
  const remainder = (randomNumber - integer).toString().replace('0.', '');
  const amend = remainder.slice(0, length - String(integer).length);
  return `${integer}${amend}`;
};
