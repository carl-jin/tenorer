import { BaseEvent } from "./modules/BaseEvent";
import "./less/index.less";
import {
  FooterIconsName,
  gen_image_item,
  GifObj,
  template,
} from "./modules/template";
import { TenorGifItem, TenorSDK } from "./modules/TenorSDK";
import { SvgName } from "@/modules/svg";
//  @ts-ignore
import delegate from "delegate";

export declare type TenorerOptions = {
  APIKey: string;
  el: HTMLElement;
  theme: "light" | "dark";
  limit: number;
};

type TenorEvent = {
  select: (gift: GifObj) => void;
  hover: (gift: GifObj) => void;
  typeChangeStart: (type: FooterIconsName) => void;
  typeChangeEnded: (type: FooterIconsName) => void;
};

export class Tenorer extends BaseEvent<TenorEvent> {
  private SDK: TenorSDK;
  private defaultOptions: Partial<TenorerOptions> = {
    theme: "dark",
    limit: 7 * 7,
  };
  private options: TenorerOptions;
  private el: HTMLElement;
  private lazyImageObserver: any;
  private currentReviewId: string = "";

  constructor(_options: Partial<TenorerOptions>) {
    super();

    this.options = Object.assign(
      this.defaultOptions,
      _options
    ) as TenorerOptions;

    if (!this.options.APIKey || !this.options.el) {
      throw new Error("tenorer: missing parameters, pls provide APIKey and el");
    }

    this.SDK = new TenorSDK(this.options.APIKey);
    this.el = this.options.el;

    this.init();
  }

  init() {
    this.render_dom();
    this.bind_event();

    this.set_default().then();
  }

  private bind_event() {
    this.bind_footer_icons_event();
    this.bind_gift_event();
    this.bind_search_event();
  }

  public async change_gifs_type(type: FooterIconsName, force: boolean = false) {
    this.$emit("typeChangeStart", type);
    let target = this.el.querySelector(`.tenorer-footer [data-id="${type}"]`);
    let title = this.el.querySelector(".tenorer-type-title") as HTMLDivElement;
    if (target.classList.contains("active") && !force) return;

    let active = this.el.querySelector(".tenorer-footer>button.active");
    active && active.classList.remove("active");

    target.classList.add("active");

    //  @ts-ignore
    let id = target.dataset.id as SvgName;
    await this.handler_footer_icon_click(id);
    title.innerHTML = `Search for "${id}"`;
    this.$emit("typeChangeEnded", type);
  }

  public set_review_image_by_id(id: string) {
    if (id === this.currentReviewId) return;
    let el = document.querySelector(
      `.tenorer-gifs-box .tenorer-image-item[data-id="${id}"]`
    );
    this.currentReviewId = id;

    let scriptTag = el.querySelector("script");
    let imgObj = JSON.parse(scriptTag.text.trim()) as GifObj;

    this.show_hover_gif(imgObj);
    this.$emit("hover", imgObj);
  }

  public search(keyword: string) {
    let box = this.el.querySelector(".tenorer-gifs-box") as HTMLDivElement;
    let title = this.el.querySelector(".tenorer-type-title") as HTMLDivElement;
    box.innerHTML = "<span class='loading'>loading</span>";
    title.innerHTML = "";
    let active = this.el.querySelector(".tenorer-footer>button.active");
    active && active.classList.remove("active");

    //  xss remove
    keyword = keyword
      .replace(/\&/g, "&amp;")
      .replace(/\</g, "&lt;")
      .replace(/\>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/\'/g, "&#x27")
      .replace(/\//g, "&#x2F");

    if (keyword.trim().length > 0) {
      this.SDK.get_search(keyword).then((res) => {
        this.render_images(res);
        title.innerHTML = `Search for "${keyword}"`;
      });
    } else {
      this.change_gifs_type("trending");
    }
  }

  public destroy() {
    this.el.innerHTML = "";
    this.SDK = null;
  }

  private bind_search_event() {
    let input = this.options.el.querySelector(
      ".tenoer-search-wrap input"
    ) as HTMLInputElement;
    let clearBtn = this.options.el.querySelector(
      ".tenorer-search-close"
    ) as HTMLButtonElement;
    let searchBtn = this.options.el.querySelector(".tenorer-search-icon");

    input.addEventListener("input", (ev) => {
      const target = ev.target as HTMLInputElement;
      const value: string = target.value.trim();

      if (value.length === 0) {
        clearBtn.classList.add("hidden");
      } else {
        clearBtn.classList.remove("hidden");
      }
    });

    input.addEventListener("search", (ev) => {
      const target = ev.target as HTMLInputElement;
      const value: string = target.value.trim();
      if (value.length === 0) return;

      this.search(value);
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      clearBtn.classList.add("hidden");
      this.search("");
    });

    searchBtn.addEventListener("click", () => {
      this.search(input.value.trim());
    });
  }

  private async set_default() {
    await this.change_gifs_type("trending");
    //  select the first gif
    let firstGif = this.el.querySelector(
      ".tenorer-gifs-box>.tenorer-image-item:first-of-type"
    );
    //  @ts-ignore
    this.set_review_image_by_id(firstGif.dataset.id);

    if (this.options.theme === "light") {
      this.el.querySelector(".tenorer").classList.add("light");
    }
  }

  private show_hover_gif(imgObj: GifObj) {
    const { height, width } = imgObj;
    let parentBox = this.options.el.querySelector(
      ".tenorer-review-box"
    ) as HTMLDivElement;
    let maxHeight = parentBox.offsetHeight - 24 - 24; // reduce padding and text height
    let maxWidth = parentBox.offsetWidth - 16; // reduce padding
    let imgHeight = height;
    let imgWidth = width;
    let isVertical = height >= width;

    if (isVertical) {
      imgHeight = maxHeight;
      imgWidth = (width * imgHeight) / height;
    } else {
      imgWidth = maxWidth;
      imgHeight = (imgWidth * height) / width;
    }

    imgWidth = Math.ceil(imgWidth);
    imgHeight = Math.ceil(imgHeight);

    let box = this.options.el.querySelector(
      ".tenorer-review"
    ) as HTMLDivElement;
    box.style.width = `${imgWidth}px`;
    box.style.height = `${imgHeight}px`;

    box.innerHTML = `<img src="${imgObj.url}" />`;
  }

  private bind_gift_event() {
    let currentHoverId = "";

    delegate(
      this.el.querySelector(".tenorer-gifs-box"),
      ".tenorer-image-item",
      "mousemove",
      (e: any) => {
        let el = e.delegateTarget;
        let id = el.dataset.id as string;
        this.set_review_image_by_id(id);
      },
      false
    );

    //  click 事件
    delegate(
      this.el.querySelector(".tenorer-gifs-box"),
      ".tenorer-image-item",
      "click",
      (e: any) => {
        let el = e.delegateTarget;

        let scriptTag = el.querySelector("script");
        let imgObj = JSON.parse(scriptTag.text.trim()) as GifObj;

        this.$emit("select", imgObj);
      },
      false
    );
  }

  private async handler_footer_icon_click(id: SvgName) {
    let res: TenorGifItem[] = [];
    if (id === "trending") {
      res = await this.SDK.get_trending(this.options.limit);
    } else if (id === "random") {
      res = await this.SDK.get_random(this.options.limit);
    } else {
      res = await this.SDK.get_search(id, this.options.limit);
    }

    this.render_images(res);
  }

  private bind_footer_icons_event() {
    Array.from(this.el.querySelectorAll(".tenorer-footer>button")).map(
      (el: HTMLButtonElement) => {
        el.addEventListener("click", () => {
          this.change_gifs_type(el.dataset.id as FooterIconsName);
        });
      }
    );
  }

  private render_images(items: TenorGifItem[]) {
    this.el.querySelector(".tenorer-gifs-list").scrollTop = 0;
    if (this.lazyImageObserver && this.lazyImageObserver.disconnect) {
      this.lazyImageObserver.disconnect();
    }

    let imagesHtml = ``;

    items.map((item) => {
      if (item.media[0].gif) {
        imagesHtml += gen_image_item({
          preview: item.media[0].gif.preview,
          url: item.media[0].gif.url,
          previewGif: item.media[0].tinygif.url,
          width: item.media[0].gif.dims[0],
          height: item.media[0].gif.dims[1],
          title: item.content_description,
          id: item.id,
        });
      }
    });

    this.el.querySelector(".tenorer-gifs-box").innerHTML = imagesHtml;
    let images = Array.from(
      this.el.querySelectorAll(".tenorer-gifs-box .tenorer-image-item")
    );

    function onIntersection(entites: any) {
      entites.forEach((entry: any) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          let img = entry.target.querySelector("img");
          img.src = img.dataset.src;
        }
      });
    }

    let observer = new IntersectionObserver(onIntersection, {
      root: this.el.querySelector(".tenorer-gifs-list"),
      rootMargin: "0px 0px 40px 0px",
    });

    images.forEach((img) => observer.observe(img));
  }

  private render_dom() {
    this.options.el.innerHTML = template();
  }
}
