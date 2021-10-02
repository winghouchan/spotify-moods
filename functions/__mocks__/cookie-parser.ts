export default () => (request: any, response: any, next: any) => {
  response.cookie = jest.fn();
  next();
};
