import { createEntityClient } from './entityClient';

const client = createEntityClient('creatives');

client.save = (item) => client.create(item);

export const Creative = client;

export default Creative;
