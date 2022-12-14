import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { YoutubeManager } from "./api/youtube";
import PaginationBtn from "./components/buttons/pagination_btn";
import YouTube from "react-youtube";
import classnames from "classnames";
import PromisePool from "@supercharge/promise-pool/dist";
export default function Home() {
  const youtube = new YoutubeManager();
  const [query, setQuery] = useState<string>("");
  const [video, selectVideo] = useState<{ id: string; opts: {} }>();
  const [result, setResult] = useState<
    {
      id: string;
      title: string;
      scripts: {
        text: string;
        duration: number;
        offset: number;
      }[];
    }[]
  >([]);
  const search = async () => {
    const result = await youtube.filterFromLocal(query);

    const { results, errors } = await PromisePool.withConcurrency(10)
      .for(result)
      .process(async (video, index, pool) => {
        const title = await youtube.getVideoData(video.id);
        return { title: title, ...video };
      });

    setResult(results);

    //let result: string[] = [];
    //let list = await youtube.searchList(query);
    // while (1) {
    //   let list = await youtube.searchList(query);
    //   if (list.length == 0) {
    //     break;
    //   }
    //   const ids = list.map((item) => item.id);
    //   result = result.concat(ids);
    // }
    //console.log(list);
  };
  const next = async () => {
    console.log("next test");
  };
  const prev = async () => {
    console.log("prev test");
  };
  return (
    <div className="h-full px-10">
      <div className="p-4 text-2xl font-semibold text-red-600">
        Youtube Clip Search
      </div>
      <div className="flex items-center justify-center mt-1">
        <input
          className="w-[60%] h-11 p-2"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        ></input>
        <div
          className="px-4 py-2 ml-4 bg-green-400 cursor-pointer select-none active:bg-slate-300"
          onClick={search}
        >
          Search
        </div>
      </div>
      <div className="p-4 mt-10 border-2 rounded-xl">
        <h1 className="font-bold ">
          Search Result {result.map((item) => item.scripts).flat().length}
        </h1>
        <div className="flex flex-col items-center justify-between w-full h-full px-10 mt-10 lg:items-start lg:flex-row">
          <div className="mt-2 mr-8 youtubeContainer">
            <YouTube
              className={classnames(
                result.map((item) => item.scripts).flat().length == 0
                  ? "hidden"
                  : "block",
              )}
              id=""
              videoId={video?.id}
              opts={video?.opts}
              // iframeClassName={"youtubeContainer"}
            />
          </div>

          <div className="w-full h-[400px] overflow-auto">
            {result.map((item, index) => {
              if (item.scripts.length == 0) {
                return <></>;
              } else {
                return (
                  <div key={index} className="p-1 md:mt-2">
                    <div className="flex justify-between p-2 bg-slate-700">
                      <p>{item.title}</p>
                      {/* <div className="flex">
                        <p>VideoID:</p>
                        <p className="ml-2">{item.id}</p>
                      </div> */}
                    </div>

                    {item.scripts.map((script, index) => {
                      return (
                        // <Link
                        //   className="flex justify-between px-5 py-2 bg-slate-800 active:bg-slate-400"
                        //   key={index}
                        //   target="_blank"
                        //   href={`https://www.youtube.com/watch?v=${item.id}&t=${
                        //     script.offset / 1000
                        //   }s`}
                        // >
                        //   <div>{script.text}</div>
                        //   <div className="w-16 ml-2 text-center bg-red-600 rounded-md">
                        //     {script.offset / 1000}s
                        //   </div>
                        // </Link>
                        <div
                          className="flex justify-between px-5 py-2 bg-slate-800 active:bg-slate-400 hover:bg-slate-500"
                          key={index}
                          onClick={() => {
                            selectVideo({
                              id: `${item.id}`,
                              opts: {
                                playerVars: {
                                  autoplay: 1,
                                  start: script.offset / 1000, // begin playing the video at the given number of seconds from the start of the video
                                },
                              },
                            });
                          }}
                        >
                          <div>{script.text}</div>
                          <div className="w-16 ml-2 text-center bg-red-600 rounded-md">
                            {script.offset / 1000}s
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
