import { BaseEvent } from "./modules/BaseEvent";
import "./less/index.less";
import { FooterIconsName, GifObj } from "./modules/template";
export declare type TenorerOptions = {
    APIKey: string;
    el: HTMLElement;
    theme: "light" | "dark";
    limit: number;
};
declare type TenorEvent = {
    select: (gift: GifObj) => void;
    hover: (gift: GifObj) => void;
    typeChangeStart: (type: FooterIconsName) => void;
    typeChangeEnded: (type: FooterIconsName) => void;
};
export declare class Tenorer extends BaseEvent<TenorEvent> {
    private SDK;
    private defaultOptions;
    private options;
    private el;
    private lazyImageObserver;
    private currentReviewId;
    constructor(_options: Partial<TenorerOptions>);
    init(): void;
    private bind_event;
    change_gifs_type(type: FooterIconsName, force?: boolean): Promise<void>;
    set_review_image_by_id(id: string): void;
    search(keyword: string): void;
    destroy(): void;
    private bind_search_event;
    private set_default;
    private show_hover_gif;
    private bind_gift_event;
    private handler_footer_icon_click;
    private bind_footer_icons_event;
    private render_images;
    private render_dom;
}
export {};
