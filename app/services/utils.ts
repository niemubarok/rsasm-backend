import { DateTime } from 'luxon'
import QRCode from 'qrcode'

const createQRCode = () => {
  return QRCode.toDataURL('https://rsasm.vercel.app/#/').then((url) => {
    return url
  })
}

const getHariIni = () => {
  const hari = ['sabtu', 'akhad', 'senin', 'selasa', 'rabu', 'kamis', 'jumat']
  const getDayNumber = DateTime.now().get('day')
  const hariIni = hari[getDayNumber]
  return hariIni
}

export { createQRCode, getHariIni }
