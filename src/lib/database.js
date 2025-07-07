import { PrismaClient } from '@prisma/client';

// Singleton pattern pre Prisma klienta
let prisma;

if (typeof window === 'undefined') {
  // Server-side only
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    // V development móde používame globálnu premennú aby sme predišli
    // vytvoreniu viacerých inštancií pri hot reload
    if (!global.__prisma) {
      global.__prisma = new PrismaClient();
    }
    prisma = global.__prisma;
  }
}

export { prisma };

// Helper funkcie pre databázové operácie
export const db = {
  // Band Members
  bandMembers: {
    findMany: () => prisma.bandMember.findMany({ orderBy: { sortOrder: 'asc' } }),
    findById: (id) => prisma.bandMember.findUnique({ where: { id: parseInt(id) } }),
    create: (data) => prisma.bandMember.create({ data }),
    update: (id, data) => prisma.bandMember.update({ where: { id: parseInt(id) }, data }),
    delete: (id) => prisma.bandMember.delete({ where: { id: parseInt(id) } })
  },

  // Albums
  albums: {
    findMany: () => prisma.album.findMany({ 
      include: { songs: true }, 
      orderBy: { sortOrder: 'asc' } 
    }),
    findById: (id) => prisma.album.findUnique({ 
      where: { id: parseInt(id) }, 
      include: { songs: { orderBy: { trackNumber: 'asc' } } } 
    }),
    create: (data) => prisma.album.create({ data }),
    update: (id, data) => prisma.album.update({ where: { id: parseInt(id) }, data }),
    delete: (id) => prisma.album.delete({ where: { id: parseInt(id) } })
  },

  // Songs
  songs: {
    findMany: () => prisma.song.findMany({ 
      include: { album: true }, 
      orderBy: { trackNumber: 'asc' } 
    }),
    findById: (id) => prisma.song.findUnique({ 
      where: { id: parseInt(id) }, 
      include: { album: true } 
    }),
    findByAlbum: (albumId) => prisma.song.findMany({ 
      where: { albumId: parseInt(albumId) }, 
      orderBy: { trackNumber: 'asc' } 
    }),
    create: (data) => prisma.song.create({ data }),
    update: (id, data) => prisma.song.update({ where: { id: parseInt(id) }, data }),
    delete: (id) => prisma.song.delete({ where: { id: parseInt(id) } })
  },

  // Gallery Categories
  galleryCategories: {
    findMany: () => prisma.galleryCategory.findMany({ 
      include: { photos: true }, 
      orderBy: { sortOrder: 'asc' } 
    }),
    findById: (id) => prisma.galleryCategory.findUnique({ 
      where: { id: parseInt(id) }, 
      include: { photos: { orderBy: { sortOrder: 'asc' } } } 
    }),
    create: (data) => prisma.galleryCategory.create({ data }),
    update: (id, data) => prisma.galleryCategory.update({ where: { id: parseInt(id) }, data }),
    delete: (id) => prisma.galleryCategory.delete({ where: { id: parseInt(id) } })
  },

  // Gallery Photos
  galleryPhotos: {
    findMany: () => prisma.galleryPhoto.findMany({ 
      include: { category: true }, 
      orderBy: { sortOrder: 'asc' } 
    }),
    findById: (id) => prisma.galleryPhoto.findUnique({ 
      where: { id: parseInt(id) }, 
      include: { category: true } 
    }),
    findByCategory: (categoryId) => prisma.galleryPhoto.findMany({ 
      where: { categoryId: parseInt(categoryId) }, 
      orderBy: { sortOrder: 'asc' } 
    }),
    create: (data) => prisma.galleryPhoto.create({ data }),
    update: (id, data) => prisma.galleryPhoto.update({ where: { id: parseInt(id) }, data }),
    delete: (id) => prisma.galleryPhoto.delete({ where: { id: parseInt(id) } })
  },

  // Concerts
  concerts: {
    findMany: () => prisma.concert.findMany({ orderBy: { eventDate: 'desc' } }),
    findById: (id) => prisma.concert.findUnique({ where: { id: parseInt(id) } }),
    findUpcoming: () => prisma.concert.findMany({ 
      where: { 
        eventDate: { gte: new Date() },
        isPublished: true 
      }, 
      orderBy: { eventDate: 'asc' } 
    }),
    create: (data) => prisma.concert.create({ data }),
    update: (id, data) => prisma.concert.update({ where: { id: parseInt(id) }, data }),
    delete: (id) => prisma.concert.delete({ where: { id: parseInt(id) } })
  },

  // Users
  users: {
    findByEmail: (email) => prisma.user.findUnique({ where: { email } }),
    findByName: (name) => prisma.user.findFirst({ where: { name } }),
    create: (data) => prisma.user.create({ data })
  }
};
