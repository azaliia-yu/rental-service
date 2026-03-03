
export type OfferLocation = {
    latitude: number;
    longitude: number;
    zoom: number;
};

export type CityOffer = {
    name: string;
    location: OfferLocation;
}

export type HostOffer = {
    name: string;
    avatarUrl: string;
    isPro: boolean;
}

export type FullOffer = {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  city: CityOffer;
  location: OfferLocation;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  bedrooms: number;        
  maxAdults: number;       
  goods: string[];         
  images: string[];        
  host: {
    name: string;
    avatarUrl: string;     
    isPro: boolean;
  };
};

export type ServerOffer = {
  id: string;
  title: string;
  description: string;
  publishDate: string;          
  city: {
    name: string;
    location: {
      latitude: number;
      longitude: number;
      zoom: number;
    };
  };
  location: {
    latitude: number;
    longitude: number;
  };
  previewImage: string;         
  photos: string[];             
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: string;
  rooms: number;               
  guests: number;               
  price: number;
  features: string[];           
  commentsCount?: number;       
  author: {                     
    id: number;
    name: string;
    avatar: string;             
    isPro: boolean;
  };
};

export type OffersList = {
    id: string;
    title: string;
    type: string;
    price: number;
    city: CityOffer;
    location: OfferLocation;
    isFavorite: boolean;
    isPremium: boolean;
    rating: number;
    previewImage: string;
};