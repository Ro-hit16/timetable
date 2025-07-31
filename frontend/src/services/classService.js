import axios from 'axios';

const API_URL = '/api/classes';

const getAll = () => axios.get(API_URL);

const create = (data) => axios.post(API_URL, data);

const update = (id, data) => axios.put(`${API_URL}/${id}`, data);

const remove = (id) => axios.delete(`${API_URL}/${id}`);

const removeAll = () => axios.delete('/api/classes');

export default {
  getAll,
  create,
  update,
  remove
};
