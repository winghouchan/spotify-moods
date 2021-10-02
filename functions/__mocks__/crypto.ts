export default {
  randomBytes: jest
    .fn()
    .mockReturnValue({ toString: jest.fn().mockReturnValue("") }),
};
