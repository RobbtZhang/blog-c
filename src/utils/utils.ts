import timeFormat from 'dayjs'
import { getFollower } from '@/services/profile'

export const debounce = (func: Function, wait: number): Function => {
  let timer: number | undefined
  let count = 0
  return (...args: string[]) => {
    clearTimeout(timer)
    if (count === 0) {
      func(...args)
      count++
    } else {
      timer = setTimeout(() => {
        func(...args)
        count++
      }, wait)
    }
  }
}

export const time = (timer: Date) => {
  return timeFormat(timer).format('YYYY-MM-DD HH:mm:ss')
}
