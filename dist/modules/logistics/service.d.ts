interface Coordinates {
    lat: number;
    lng: number;
}
export declare class LogisticsService {
    geocode(location: string): Promise<Coordinates>;
    calculateDistance(fromLocation: string, toLocation: string): Promise<number>;
    private haversineDistance;
    private toRad;
    calculateDeliveryFee(distanceKm: number): number;
    getDeliveryQuote(fromLocation: string, toLocation: string): Promise<{
        distance: number;
        fee: number;
    }>;
}
export {};
//# sourceMappingURL=service.d.ts.map