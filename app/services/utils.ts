import { DateTime } from 'luxon'
import QRCode from 'qrcode'

const createQRCode = async () => {
  return await QRCode.toDataURL('https://rsasm.vercel.app/#/').then((url) => {
    return url
  })
}

const getHari = (dayNumber: number) => {
  const listHari = ['akhad', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']
  // const getDayNumber = DateTime.now().get('day')
  // console.log(listHari[dayNumber])

  return listHari[dayNumber]
}

const padNumber = (number: number, length: number) => {
  let str = '' + number
  while (str.length < length) {
    str = '0' + str
  }
  return str
}

const umur = (birthDate) => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const date = today.getDate()

  const lahir = birthDate.split('-')
  const birthYear = year - lahir[0]
  const birthMonth = month - lahir[1]

  const lastMonthDate = new Date(year, month, 0).getDate()
  const dayCount = lastMonthDate - lahir[2] + date

  return `${birthYear} Th ${birthMonth} Bl ${dayCount} Hr`
}

const formatDate = (tgl: string, format: any) => {
  return new Date(tgl).toLocaleString('id', format)
}

export { createQRCode, getHari, padNumber, umur, formatDate }
