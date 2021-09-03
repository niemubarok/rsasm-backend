import { DateTime } from 'luxon'
import QRCode from 'qrcode'

const createQRCode = () => {
  return QRCode.toDataURL('https://rsasm.vercel.app/#/').then((url) => {
    return url
  })
}

const getHari = (dayNumber: number) => {
  const listHari = ['akhad', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']
  // const getDayNumber = DateTime.now().get('day')
  // console.log(listHari[dayNumber])

  return listHari[dayNumber]
}


export { createQRCode, getHari }
