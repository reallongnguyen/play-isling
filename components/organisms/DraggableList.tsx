'use client'

import { useSprings, animated } from '@react-spring/web'
import { useEffect, useRef } from 'react'
import { useDrag } from '@use-gesture/react'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'

const getItemStyle =
  (
    orders: number[],
    itemHeight: number,
    active = false,
    dragItemCurIndex = 0,
    dragItemOrgIndex = 0,
    y = 0,
    preventAnimation = false
  ) =>
  (index: number) => {
    if (active && dragItemOrgIndex === index) {
      return {
        y: dragItemCurIndex * itemHeight + y,
        scale: 1.04,
        zIndex: 99999,
        immediate: (key: string) => key === 'y' || key === 'zIndex',
      }
    }

    let curIndex = orders.findIndex((item) => item === index)
    curIndex = curIndex >= 0 ? curIndex : index

    return {
      y: curIndex * itemHeight,
      scale: 1,
      zIndex: 9900,
      immediate: preventAnimation,
    }
  }

export interface DraggableListProps<T> {
  list: T[]
  getItemId: (item: T) => string | number
  renderItem: (item: T, attr: ReactDOMAttributes) => React.ReactNode
  itemHeight: number
  changeListOrder?: (newOrder: number[]) => void | Promise<void>
  dragOnItem?: boolean
}

export function DraggableList<T>(props: DraggableListProps<T>) {
  const { list, itemHeight, dragOnItem = true } = props

  const orders = useRef(list.map((item, i) => i))

  const [springs, api] = useSprings(
    list.length,
    getItemStyle(orders.current, itemHeight),
    [list]
  )

  const lastDrag = useRef<Record<string, any>>({})

  const bind = useDrag(
    ({
      args: [dragItemOrgIndex],
      active,
      movement: [, y],
      dragging,
      cancel,
    }) => {
      const curIndex = orders.current.findIndex(
        (item) => item === dragItemOrgIndex
      )

      const bias = y > 0 ? itemHeight / 2 : 0

      const newIndex = Math.min(
        Math.max(Math.round(curIndex + (y + bias) / itemHeight), 0),
        list.length
      )

      let newOrders = orders.current

      if (curIndex !== newIndex) {
        newOrders = [
          ...orders.current.slice(0, newIndex),
          orders.current[curIndex],
          ...orders.current.slice(newIndex),
        ]

        const deleteIndex = newIndex > curIndex ? curIndex : curIndex + 1
        newOrders.splice(deleteIndex, 1)
      }

      api.start(
        getItemStyle(
          newOrders,
          itemHeight,
          active,
          curIndex,
          dragItemOrgIndex,
          y
        )
      )

      if (!active && curIndex !== newIndex) {
        console.log(`change order ${curIndex} -> ${newIndex}`)

        orders.current = newOrders
        setTimeout(() => {
          if (props.changeListOrder) {
            props.changeListOrder(newOrders)
          }
        }, 600)
      }

      lastDrag.current = {
        cancel,
        dragging,
        timeStamp: Date.now(),
      }
    }
  )

  // FIXME: hot fix bug long-press on chrome for iphone
  // It may be make conflict with other feature
  useEffect(() => {
    const id = setInterval(() => {
      if (!lastDrag.current.dragging) {
        return
      }

      if (
        Date.now() - lastDrag.current.timeStamp > 5000 &&
        lastDrag.current.cancel
      ) {
        lastDrag.current.cancel()
      }
    }, 500)

    return () => {
      clearInterval(id)
    }
  }, [])

  useEffect(() => {
    orders.current = list.map((item, i) => i)

    api.start(getItemStyle(orders.current, itemHeight, false, 0, 0, 0, true))
  }, [list, api, itemHeight])

  return (
    <>
      {springs.map((style, index) => (
        <animated.div
          className="absolute w-full"
          key={props.getItemId(list[index])}
          style={style}
          {...(dragOnItem ? bind(index) : [])}
        >
          {props.renderItem(list[index], bind(index))}
        </animated.div>
      ))}
    </>
  )
}
