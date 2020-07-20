import path from "path"
import { parseList, UrlListType } from "../urlListParser"

describe("parseList", () => {
  test("エクセルを読み込んで配列で返す", async () => {
    const expected: UrlListType = new Map([
      [
        1,
        {
          title: "",
          index: 1,
          url: "https://google.com",
          logic: null,
          done: false,
          capturing: false,
          invalidUrl: false,
          status: null,
          captureTargets: {
            pc: ["pdf"],
            sp: ["img", "pdf"],
            tablet: ["pdf"],
          },
        },
      ],
    ])
    expect(
      await parseList(path.resolve(__dirname, "./data/urls2.xlsx"))
    ).toEqual(expected)
  })
})
