export default {
  save(state, { payload }) {
    return {
      ...state,
      ...payload,
    };
  },
  update(state, { payload }) {
    const { name, value } = payload;
    return {
      ...state,
      ...{
        [name]: Array.isArray(state[name])
          ? [...state[name], ...value]
          : { ...state[name], ...value },
      },
    };
  },
};
