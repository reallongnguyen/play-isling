import { Room } from '../../models/Room'

const rooms: Record<string, Room> = {
  'btc-studio': {
    id: 1,
    name: 'BTC Studio',
    owner: 1,
    sharingTo: 'public',
    audienceCount: 0,
    audiences: [],
    cover:
      'https://images.unsplash.com/photo-1621221815245-6e9039a6ff3c?ixlib=rb-4.0.3&ixslug=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    slug: 'btc-studio',
    description: '',
  },
  isling: {
    id: 2,
    name: 'isling',
    owner: 2,
    sharingTo: 'public',
    audienceCount: 0,
    audiences: [],
    cover:
      'https://images.unsplash.com/photo-1468853692559-fc594e932a2d?ixlib=rb-4.0.3&ixslug=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    slug: 'isling',
    description: 'isling and friends :>',
  },
  chill: {
    id: 3,
    name: 'Chill',
    owner: 3,
    sharingTo: 'public',
    audienceCount: 0,
    audiences: [],
    cover:
      'https://images.unsplash.com/photo-1531574373289-ad0d66e39ba9?ixlib=rb-4.0.3&ixslug=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    slug: 'chill',
    description: "Don't take things too seriously, and just chill",
  },
  sleep: {
    id: 4,
    name: 'Sleep',
    owner: 1,
    sharingTo: 'member',
    audienceCount: 0,
    audiences: [],
    cover:
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&ixslug=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    slug: 'sleep',
    description: '',
  },
  'pub-music': {
    id: 5,
    name: 'Pub Bar Music',
    owner: 2,
    sharingTo: 'member',
    audienceCount: 0,
    audiences: [],
    cover:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixslug=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    slug: 'pub-music',
    description: '',
  },
  baroque: {
    id: 6,
    name: 'Baroque',
    owner: 1,
    sharingTo: 'public',
    audienceCount: 0,
    audiences: [],
    cover:
      'https://images.unsplash.com/photo-1491566102020-21838225c3c8?ixlib=rb-4.0.3&ixslug=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    slug: 'baroque',
    description: '',
  },
}

export const getForYouRooms = () => {
  return Object.values(rooms)
}

export const getRoomBySlug = (slug: string) => rooms[slug]
