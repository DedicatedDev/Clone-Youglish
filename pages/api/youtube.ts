import youtubeSearch from "youtube-search";
import dotenv from "dotenv";
import PromisePool from "@supercharge/promise-pool/dist";
import YoutubeTranscript from "./transcript";
import DB from "../../data.json";
dotenv.config();
export class YoutubeManager {
  private API_KEY: string = process.env.YOUTUBE_DATA3_API_KEY;
  private paginationInfo?: youtubeSearch.YouTubeSearchPageResults;
  private query: string = "";
  private searchOpts: youtubeSearch.YouTubeSearchOptions = {
    maxResults: 1000,
    key: "AIzaSyADOZ4h6gjzG50k89FH0r6VnMsUp7OfWlc",
    //location: "CA",
    channelId: "UC1p_2ubjLlYpMTM3LtSLwtg",
  };

  constructor(searchOption?: youtubeSearch.YouTubeSearchOptions) {
    if (searchOption != undefined) {
      this.searchOpts = searchOption;
    }
  }
  async searchList(query: string) {
    this.query = query;
    const result = await youtubeSearch(this.query, this.searchOpts);
    this.paginationInfo = result.pageInfo;
    return result.results;
  }
  async nextList() {
    if (this.paginationInfo == undefined) {
      return [];
    }
    this.searchOpts.pageToken = this.paginationInfo?.nextPageToken;
    const result = await youtubeSearch(this.query, this.searchOpts);
    this.paginationInfo = result.pageInfo;
    return result.results;
  }
  async prevList() {
    if (this.paginationInfo == undefined) {
      return [];
    }
    this.searchOpts.pageToken = this.paginationInfo?.prevPageToken;
    const result = await youtubeSearch(this.query, this.searchOpts);
    this.paginationInfo = result.pageInfo;
    return result.results;
  }
  async filteredScripts(ids: string[]) {
    //const script = await YoutubeTranscript.fetchTranscript("qRJelL1V38E");
    // const { results, errors } = await PromisePool.withConcurrency(2)
    //   .for(ids)
    //   .process(async (id, index, pool) => {
    //     const script = await YoutubeTranscript.fetchTranscript(id);
    //     const filteredScripts = script.filter((item: TranscriptResponse) =>
    //       item.text.includes(this.query)
    //     );
    //     return { id: filteredScripts };
    //   });
    // console.log(errors);
    // console.log(results);
    return [];
  }
  async filterFromLocal(query: string) {
    console.log(query);
    const allowedSeparator = "\\s,;\"'|";
    const pattern = new RegExp(
      `(^.*[${allowedSeparator}]${query}$)|(^${query}[${allowedSeparator}].*)|(^${query}$)|(^.*[${allowedSeparator}]${query}[${allowedSeparator}].*$)`,
      // Case insensitive
      "i"
    );
    console.log(pattern);
    const res = DB.map((item) => {
      return {
        id: item.id,
        scripts: item.script.filter((item) => item.text.match(pattern)),
      };
    });
    return res.flat();
  }
}
