import { obj2Query } from "../utils";

const API_HOST = `https://g.tenor.com/v1`;

export type TenorMedia = {
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
    url: string;
    dims: [number, number];
  };
};

export type TenorGifItem = {
  id: string;
  title: string;
  content_description: string;
  media: TenorMedia[];
};

export class TenorSDK {
  private ApiKey: string = "";
  constructor(ApiKey: string) {
    this.ApiKey = ApiKey;
  }

  get_search(keyword: string, limit: number = 24) {
    return this.request(
      this.gen_api_link("search", {
        limit: limit,
        q: keyword,
      })
    );
  }

  get_random(limit: number = 24) {
    return this.request(
      this.gen_api_link("random", {
        limit: limit,
      })
    );
  }

  get_trending(limit: number = 24) {
    return this.request(
      this.gen_api_link("trending", {
        limit: limit,
      })
    );
  }

  private request(link: string): Promise<TenorGifItem[]> {
    return new Promise((res) => {
      fetch(link)
        .then((response) => response.json())
        .then((data) => {
          return res(data.results);
        });
    });
  }

  private gen_api_link(path: string, args: Record<string, any>) {
    return `${API_HOST}${
      path.indexOf("/") === 0 ? path : `/${path}`
    }?${obj2Query({
      key: this.ApiKey,
      ...args,
    })}`;
  }
}
