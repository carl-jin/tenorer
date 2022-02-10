import { SvgName } from "./svg";
export declare const footerIcons: SvgName[];
export declare type GifObj = {
    preview: string;
    url: string;
    width: number;
    height: number;
    title: string;
    previewGif: string;
    id: string;
    duration: number;
};
export declare type FooterIconsName = typeof footerIcons[number];
export declare function template(): string;
/**
 * 生成 image item
 * @param args
 */
export declare function gen_image_item(args: GifObj): string;
