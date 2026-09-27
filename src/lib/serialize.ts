export interface SerializedAd {
  id: string
  name: string
  price: number
  description: string
  category: string
  whatsapp: number
  date: Date | string
  userId: string
}

interface AdToSerialize {
  _id?: { toString(): string } | string
  id?: string
  name: string
  price: number
  description: string
  category: string
  whatsapp: number
  date: Date | string
  userId?: { toString(): string } | string
}

export function serializeAd(ad: AdToSerialize): SerializedAd {
  return {
    id: ad._id ? ad._id.toString() : (ad.id ?? ''),
    name: ad.name,
    price: ad.price,
    description: ad.description,
    category: ad.category,
    whatsapp: ad.whatsapp,
    date: ad.date,
    userId: ad.userId ? ad.userId.toString() : ''
  }
}
