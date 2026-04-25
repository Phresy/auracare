// 1. Define the interface to ensure type safety
export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    rx: boolean;
}

// 2. Explicitly export the array
export const PRODUCTS: Product[] = [
    {
        id: "aur-01",
        name: "PureAscorbic Vitamin C",
        category: "Wellness",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500&auto=format&fit=crop",
        rx: false
    },
    {
        id: "aur-02",
        name: "Nebulizer Pro-Series",
        category: "Medical Devices",
        price: 89.00,
        image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=500&auto=format&fit=crop",
        rx: false
    },
    {
        id: "aur-03",
        name: "Amoxicillin Premium",
        category: "Antibiotics",
        price: 18.50,
        image: "https://images.unsplash.com/photo-1471864190281-ad5f9f81ce4c?q=80&w=500&auto=format&fit=crop",
        rx: true
    }
];

// 3. Backup default export to satisfy strict static analysis
export default PRODUCTS;