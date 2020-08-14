import path from "path"
import { parseList, UrlListType } from "../urlListParser"

describe("parseList", () => {
  test("エクセルを読み込んでMapで返す", async () => {
    const expected: UrlListType = new Map([
      [
        1,
        {
          title: "",
          index: 1,
          url: "https://google.com",
          logic: "logic",
          done: false,
          capturing: false,
          invalidUrl: false,
          status: null,
          captureTargets: {
            pc: ["img", "pdf"],
            sp: ["img", "pdf"],
            tablet: ["img", "pdf"],
          },
        },
      ],
    ])
    expect(
      await parseList(
        path.resolve(__dirname, "../../../../tests-data/test.xlsx")
      )
    ).toEqual(expected)
  })
})
