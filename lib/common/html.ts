export const getElementByScrollOffsetLeft = (
  offsetLeft: number,
  parentEle: HTMLElement
): HTMLElement | undefined => {
  for (let i = 0; i < parentEle.children.length; i += 1) {
    const ele = parentEle.children.item(i) as HTMLDivElement
    const offsetLeftOnScroll = ele.offsetLeft - parentEle.offsetLeft

    if (
      offsetLeftOnScroll <= offsetLeft &&
      offsetLeft <= offsetLeftOnScroll + ele.clientWidth
    ) {
      return ele
    }
  }

  return undefined
}

export const displayMinWidth = {
  // sm --- Small devices (landscape phones, 576px and up)
  sm: 576,

  // md --- Medium devices (tablets, 768px and up)
  md: 768,

  // lg --- Large devices (desktops, 992px and up)
  lg: 992,

  // xl --- Extra large devices (large desktops, 1200px and up)
  xl: 1200,
}
