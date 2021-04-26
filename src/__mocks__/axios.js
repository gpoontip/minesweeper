const axiosResponse = {
  data: [],
  status: 200,
  statusText: "OK",
  config: {},
  headers: {},
};

const response = {
  default: {
    get: jest.fn().mockImplementation(() => Promise.resolve(axiosResponse)),
  },
  get: jest.fn(() => Promise.resolve(axiosResponse)),
};

export default response;
