import { ContactsCollection } from '../db/models/contact.js';
import createHttpError from 'http-errors';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const deleteContactById = async (contactId) => {
  const contact = await ContactsCollection.findByIdAndDelete(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contacts = await ContactsCollection.create(payload);
  return contacts;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const response = await ContactsCollection.findByIdAndUpdate(
    contactId,
    payload,
    { ...options, new: true, includeResultMetadata: true },
  );

  const contact = response.value;
  const isNew = !response.lastErrorObject.updatedExisting;

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  return {
    contact,
    isNew,
  };
};
