import {
    Baby,
    Dumbbell,
    Headphones,
    Home,
    Laptop,
    Shirt,
} from "lucide-react";

export const categories = [
    {
        name: "Electronics",
        slug: "electronics",
        productCount: 320,
        icon: Laptop,
    },
    {
        name: "Fashion",
        slug: "fashion",
        productCount: 540,
        icon: Shirt,
    },
    {
        name: "Home & Living",
        slug: "home-living",
        productCount: 210,
        icon: Home,
    },
    {
        name: "Audio",
        slug: "audio",
        productCount: 145,
        icon: Headphones,
    },
    {
        name: "Sports",
        slug: "sports",
        productCount: 180,
        icon: Dumbbell,
    },
    {
        name: "Kids",
        slug: "kids",
        productCount: 230,
        icon: Baby,
    },
];

export const featuredProducts = [
    {
        id: "wireless-headphones",
        title: "Premium Wireless Noise Cancelling Headphones",
        storeName: "TechPoint Store",
        price: 12500,
        oldPrice: 15000,
        rating: 4.8,
        reviewCount: 124,
        badge: "17% OFF",
        imageClassName:
            "bg-gradient-to-br from-blue-100 to-indigo-200",
    },
    {
        id: "smart-watch",
        title: "Smart Fitness Watch with Heart Rate Monitor",
        storeName: "Smart Gadgets",
        price: 7999,
        oldPrice: 9500,
        rating: 4.6,
        reviewCount: 89,
        badge: "Popular",
        imageClassName:
            "bg-gradient-to-br from-orange-100 to-amber-200",
    },
    {
        id: "casual-shirt",
        title: "Premium Cotton Casual Shirt for Men",
        storeName: "Urban Styles",
        price: 2499,
        oldPrice: 3200,
        rating: 4.7,
        reviewCount: 67,
        badge: "New",
        imageClassName:
            "bg-gradient-to-br from-emerald-100 to-teal-200",
    },
    {
        id: "desk-lamp",
        title: "Modern LED Desk Lamp with Adjustable Brightness",
        storeName: "Home Studio",
        price: 3850,
        rating: 4.5,
        reviewCount: 52,
        imageClassName:
            "bg-gradient-to-br from-pink-100 to-rose-200",
    },
];
export const topStores = [
    {
        name: "TechPoint Store",
        slug: "techpoint-store",
        category: "Electronics & Gadgets",
        rating: 4.9,
        reviews: 340,
        products: 128,
        initials: "TP",
    },
    {
        name: "Urban Styles",
        slug: "urban-styles",
        category: "Fashion & Clothing",
        rating: 4.8,
        reviews: 286,
        products: 94,
        initials: "US",
    },
    {
        name: "Home Studio",
        slug: "home-studio",
        category: "Home & Living",
        rating: 4.7,
        reviews: 196,
        products: 76,
        initials: "HS",
    },
    {
        name: "Smart Gadgets",
        slug: "smart-gadgets",
        category: "Accessories",
        rating: 4.8,
        reviews: 225,
        products: 103,
        initials: "SG",
    },
];