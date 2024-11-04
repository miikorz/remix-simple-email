import { prisma } from '../db.server';
import type { AppLoadContext } from '@remix-run/node';
import { loader, action } from '../routes/api.tags';

jest.mock('../db.server', () => ({
  prisma: {
    tag: {
      findMany: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('tags api', () => {
  describe('loader', () => {
    it('should load all tags', async () => {
      const tags = [{ id: 1, name: 'tag1' }, { id: 2, name: 'tag2' }];
      (prisma.tag.findMany as jest.Mock).mockResolvedValue(tags);
  
      const tagsLoader = await loader({ request: new Request('http://localhost/tags') as Request, params: {}, context: {} as AppLoadContext });
      const response = await (tagsLoader as Response).json();
  
      expect(prisma.tag.findMany).toHaveBeenCalled();
      expect(response).toEqual(tags);
    });
  });
  
  describe('action', () => {
    it('should create a new tag', async () => {
      const request = new Request('http://localhost', {
        method: "POST",
        body: new URLSearchParams({
          type: "create",
          name: "new tag",
        }),
      });
  
      const mockTag = { id: 1, subject: 'new tag' };
      (prisma.tag.create as jest.Mock).mockResolvedValue(mockTag);

      const createTagAction = await action({ request, params: {}, context: {} as AppLoadContext });
      const response = await (createTagAction as Response).json();
  
      expect(prisma.tag.create).toHaveBeenCalledWith({ data: { name: "new tag" } });
      expect(response).toEqual(mockTag);
    });

    it('should delete a tag', async () => {
      const request = new Request('http://test', {
        method: "POST",
        body: new URLSearchParams({
          type: "delete",
          id: "1",
        }),
      });

      const mockTags = [{ id: 1, subject: 'tag 1' }, { id: 2, subject: 'tag 2' }];
      (prisma.tag.findMany as jest.Mock).mockResolvedValue(mockTags);
  
      const deleteTagAction = await action({ request, params: {}, context: {} as AppLoadContext });
      const response = await (deleteTagAction as Response).json();
  
      expect(prisma.tag.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(response).toEqual(mockTags);
    });
  });
});
