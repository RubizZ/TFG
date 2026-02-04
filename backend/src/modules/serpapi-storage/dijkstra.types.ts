export interface DijkstraFlightEdge {
    id: string; // booking_token o un ID único
    from: string;           
    to: string;             
    price: number;          
    duration: number;       
    stops: number;          
}