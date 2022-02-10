declare const svgList: {
    search: string;
    close: string;
    trending: string;
    love: string;
    happy: string;
    sad: string;
    like: string;
    unlike: string;
    cute: string;
    random: string;
};
export declare type SvgName = keyof typeof svgList;
export declare function gen_svg(name: SvgName): string;
export {};
