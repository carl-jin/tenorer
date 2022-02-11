import { gen_svg, SvgName } from "./svg";

export const footerIcons: SvgName[] = [
  "trending",
  "love",
  "happy",
  "sad",
  "like",
  "unlike",
  "cute",
  // "random", // random is the same with trend
];

export type GifObj = {
  preview: string;
  url: string;
  width: number;
  height: number;
  title: string;
  previewGif: string;
  id: string;
  duration: number;
  mp4Vid: string;
  mp4VidWidth: number;
  mp4VidHeight: number;
};

export type FooterIconsName = typeof footerIcons[number];

export function template() {
  let footerItems = footerIcons
    .map((key) => {
      return `<button data-id="${key}">${gen_svg(key)}</button>`;
    })
    .join("");

  return `
    <section class="tenorer">
      <div class="tenorer-container">
        <div class="tenorer-search-box">
          <div class="tenoer-search-wrap">
            <button class="tenorer-icon tenorer-search-icon">${gen_svg(
              "search"
            )}</button>
            <button class="tenorer-icon tenorer-search-close hidden">${gen_svg(
              "close"
            )}</button>
            <input type="search" placeholder="Search gifs" />
          </div>

          <a
            href="https://tenor.com/"
            title="tenor"
            class="tenorer-logo"
            rel="nofollow"
            target="_blank"
            >tenor</a
          >
        </div>

        <div class="tenorer-content">
          <div class="tenorer-review-box">
            <div class="tenorer-review">
              <img
                src="https://c.tenor.com/R_-7YcMQ17UAAAAC/homer-stuffing.gif"
                alt=""
              />
            </div>
          </div>
          <div class="tenorer-content-top">
            <div class="tenorer-gifs-list">
              <p class="tenorer-type-title"></p>
              <div class="tenorer-gifs-box">
                
              </div>
            </div>
            <div class="tenorer-footer">
                ${footerItems}
            </div>
          </div>
        </div>
      </div>
    </section>
`;
}

/**
 * 生成 image item
 * @param args
 */
export function gen_image_item(args: GifObj) {
  return `<button class="tenorer-image-item" data-id="${
    args.id
  }"><script type="text/template">${JSON.stringify(
    args
  )}</script><img data-src="${args.previewGif}"  alt="${
    args.title
  }"/></button>`;
}
