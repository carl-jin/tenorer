export declare type TenorMedia = {
    gif: {
        dims: [number, number];
        preview: string;
        url: string;
    };
    tinygif: {
        dims: [number, number];
        preview: string;
        url: string;
    };
    mp4: {
        duration: number;
    };
};
export declare type TenorGifItem = {
    id: string;
    title: string;
    content_description: string;
    media: TenorMedia[];
};
export declare class TenorSDK {
    private ApiKey;
    constructor(ApiKey: string);
    get_search(keyword: string, limit?: number): Promise<TenorGifItem[]>;
    get_random(limit?: number): Promise<TenorGifItem[]>;
    get_trending(limit?: number): Promise<TenorGifItem[]>;
    private request;
    private gen_api_link;
}
