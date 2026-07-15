declare module 'html-to-docx' {
  interface HtmlToDocxOptions {
    title?: string
    margins?: {
      top?: number
      right?: number
      bottom?: number
      left?: number
    }
  }

  function htmlToDocx(
    html: string,
    footerHtml?: string,
    options?: HtmlToDocxOptions
  ): Promise<Buffer>

  export default htmlToDocx
}
