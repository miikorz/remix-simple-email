import { prisma } from '../db.server';
import type { AppLoadContext } from '@remix-run/node';
import { loader, action } from './../routes/api.emails';

jest.mock('../db.server', () => ({
  prisma: {
    email: {
      findMany: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    tagsOnEmails: {
      create: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

describe('emails api', () => {
  describe('loader', () => {
    it('should load emails', async () => {
      const mockEmails = [{ id: 1, subject: 'Test Email' }];
      (prisma.email.findMany as jest.Mock).mockResolvedValue(mockEmails);
  
      const loadedEmails = await loader({ request: new Request('http://localhost/emails'), params: {read: "true"}, context: {} as AppLoadContext });
      const result = await (loadedEmails as Response).json();
      
      expect(prisma.email.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockEmails);
    });
  });
  
  describe('action', () => {
    it('should update the read status for an specific email', async () => {
      const request = new Request('http://localhost', {
        method: "POST",
        body: new URLSearchParams({
          type: "update read",
          emailId: "1",
          read: "true",
        }),
      });
  
      const updateAction = await action({ request , params: {}, context: {} as AppLoadContext});
      const response = await (updateAction as Response).json();

      expect(prisma.email.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { read: true },
      });
      expect(response).toEqual({ success: true });
    });

    it('should add a tag to an email', async () => {
      const request = new Request('http://localhost', {
        method: "POST",
        body: new URLSearchParams({
          type: "add tag",
          emailId: "1",
          tagId: "2",
        }),
      });
  
      const mockEmail = { id: 1, subject: 'Test Email', tags: [{ tagId: 2, emailId: 1 }] };
      (prisma.email.findUnique as jest.Mock).mockResolvedValue(mockEmail);
  
      const addTagAction = await action({ request, params: {}, context: {} as AppLoadContext });
      const response = await (addTagAction as Response).json();
  
      expect(prisma.tagsOnEmails.create).toHaveBeenCalledWith({ data: { emailId: 1, tagId: 2 } });
      expect(prisma.email.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { tags: true },
      });
      expect(response).toEqual(mockEmail);
    });
  
    it('should delete a tag from an email', async () => {
      const request = new Request('http://localhost', {
        method: "POST",
        body: new URLSearchParams({
          type: "delete tag",
          emailId: "1",
          tagId: "2",
        }),
      });
      const mockEmail = { id: 1, subject: 'Test Email', tags: [] };
      (prisma.email.findUnique as jest.Mock).mockResolvedValue(mockEmail);
  
      const deleteTagAction = await action({ request, params: {}, context: {} as AppLoadContext });
      const response = await (deleteTagAction as Response).json();
  
      expect(prisma.tagsOnEmails.delete).toHaveBeenCalledWith({
        where: { emailId_tagId: { emailId: 1, tagId: 2 } },
      });
      expect(prisma.email.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { tags: true },
      });
      expect(response).toEqual(mockEmail);
    });
  
    it('should delete an email', async () => {
      const request = new Request('http://localhost', {
        method: "POST",
        body: new URLSearchParams({
          type: "delete",
          emailId: "1",
          read: "true",
        }),
      });
  
      const mockEmails = [{ id: 2, subject: 'Another Email' }];
      (prisma.email.findMany as jest.Mock).mockResolvedValue(mockEmails);
  
      const deleteAction = await action({ request, params: {}, context: {} as AppLoadContext });
      const response = await (deleteAction as Response).json();
  
      expect(prisma.email.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(response).toEqual({ success: true });
    });
  });
});
