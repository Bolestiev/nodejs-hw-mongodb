import express from 'express';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import { getAllContacts, getContactById } from './services/contacts.js';
import { ENV_VAR } from './constants/env.js';

const PORT = +getEnvVar(ENV_VAR.MONGODB_PORT, 4000);

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pinoHttp({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res, next) => {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      res.status(404).json({
        message: 'Contact not found',
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
